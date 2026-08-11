from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets
import logging
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister, UserResponse, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
from app.services.auth_service import get_current_user
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=payload.email.lower(),
        password_hash=get_password_hash(payload.password),
        capital=payload.capital,
        risk_tolerance=payload.risk_tolerance,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        risk_tolerance=current_user.risk_tolerance,
        capital=current_user.capital,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh token — returns a fresh token for valid sessions."""
    token = create_access_token(str(current_user.id))
    return TokenResponse(access_token=token)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Generate reset token and send email via Web3Forms."""
    user = db.query(User).filter(User.email == payload.email.lower()).first()

    # Always return success (don't reveal if email exists)
    if not user:
        return MessageResponse(message="If that email exists, a reset link has been sent.")

    # Generate secure token — hex only, no special chars for email safety
    token = secrets.token_hex(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # Build reset link
    frontend_url = settings.frontend_url or "https://kw-trading-copilot.vercel.app"
    reset_link = f"{frontend_url}/reset-password?token={token}"

    # Send email via Gmail SMTP
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    if settings.gmail_user and settings.gmail_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = "Reset your AI Trading Copilot password"
            msg["From"] = settings.gmail_user
            msg["To"] = user.email
            msg["Reply-To"] = settings.gmail_user

            html_body = f"""
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#10b981;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="color:#020617;margin:0;">🔑 Password Reset</h2>
    <p style="color:#064e3b;margin:4px 0 0;">AI Trading Copilot</p>
  </div>
  <div style="background:#1e293b;padding:24px;border-radius:0 0 8px 8px;color:#f8fafc;">
    <p style="font-size:16px;">Hi,</p>
    <p style="color:#94a3b8;">We received a request to reset your password. Click the button below to set a new password:</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="{reset_link}"
         style="background:#10b981;color:#020617;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        Reset Password
      </a>
    </div>
    <p style="color:#64748b;font-size:13px;">Or copy this link:<br/>
      <a href="{reset_link}" style="color:#10b981;word-break:break-all;">{reset_link}</a>
    </p>
    <hr style="border:1px solid #334155;margin:24px 0;"/>
    <p style="color:#64748b;font-size:12px;">
      ⏰ This link expires in <strong>1 hour</strong>.<br/>
      If you did not request this, ignore this email — your password will not change.
    </p>
  </div>
</div>"""

            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
                server.ehlo()
                server.starttls()
                server.login(settings.gmail_user, settings.gmail_pass)
                server.sendmail(settings.gmail_user, [user.email], msg.as_string())

            logger.info(f"[RESET] Email sent to {user.email}")
        except Exception as e:
            logger.error(f"[RESET] Email failed: {e}")
    else:
        logger.warning(f"[RESET] Gmail not configured. Reset link: {reset_link}")

    return MessageResponse(message="If that email exists, a reset link has been sent.")


@router.get("/verify-reset-token/{token}")
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    """Check if a reset token is valid — for debugging."""
    clean = token.strip()
    user = db.query(User).filter(User.reset_token == clean).first()
    if not user:
        return {"valid": False, "reason": "token not found", "token_len": len(clean)}
    now = datetime.now(timezone.utc)
    expiry = user.reset_token_expiry
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    expired = now > expiry if expiry else True
    return {
        "valid": not expired,
        "email": user.email,
        "expired": expired,
        "expiry": str(expiry),
        "token_len": len(clean),
    }


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verify token and set new password."""
    clean_token = payload.token.strip()
    logger.info(f"[RESET] Token received len={len(clean_token)} prefix={clean_token[:16]}")

    user = db.query(User).filter(User.reset_token == clean_token).first()

    if not user or user.reset_token_expiry is None:
        # Log pending tokens for debug
        pending = db.query(User).filter(User.reset_token.isnot(None)).all()
        for u in pending:
            db_tok = str(u.reset_token or "")
            logger.warning(f"[RESET] DB token len={len(db_tok)} prefix={db_tok[:16]} match={db_tok==clean_token}")
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    now = datetime.now(timezone.utc)
    expiry = user.reset_token_expiry
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if now > expiry:
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")

    user.password_hash = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    logger.info(f"[RESET] Password reset successful for {user.email}")
    return MessageResponse(message="Password reset successfully. You can now log in.")
