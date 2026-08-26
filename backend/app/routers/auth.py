from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
import secrets
import logging
import httpx
import asyncio
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import (
    TokenResponse, UserLogin, UserRegister, UserResponse,
    ForgotPasswordRequest, ForgotPasswordResponse,
    ResetPasswordRequest, MessageResponse,
)
from app.services.auth_service import get_current_user
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


# ── Resend API email sender (HTTP — works on Render free tier) ────────────────

def _send_reset_email_resend(to_email: str, reset_link: str) -> None:
    """Send password reset email via Resend API (HTTP POST — no SMTP needed)."""
    if not settings.resend_api_key:
        logger.warning("[EMAIL] RESEND_API_KEY not configured — skipping email send")
        return

    html_body = f"""
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
             background:#0f172a;color:#e2e8f0;margin:0;padding:0;">
  <div style="max-width:480px;margin:40px auto;padding:0 16px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:#10b981;border-radius:8px;
                    display:inline-block;text-align:center;line-height:32px;
                    font-weight:900;font-size:12px;color:#0f172a;">AI</div>
        <span style="font-weight:700;font-size:16px;color:#f1f5f9;">Trading Copilot</span>
      </div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:32px;">
      <div style="font-size:32px;margin-bottom:16px;">🔑</div>
      <h1 style="font-size:22px;font-weight:900;color:#f1f5f9;margin:0 0 8px 0;">
        Reset your password
      </h1>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
        You requested a password reset for your AI Trading Copilot account.
        Click the button below to set a new password.
      </p>
      <a href="{reset_link}"
         style="display:block;background:#10b981;color:#0f172a;text-decoration:none;
                font-weight:700;font-size:14px;text-align:center;padding:14px 24px;
                border-radius:12px;margin-bottom:24px;">
        Reset Password →
      </a>
      <p style="color:#64748b;font-size:12px;margin:0 0 8px 0;">
        Or copy this link into your browser:
      </p>
      <p style="color:#10b981;font-size:11px;word-break:break-all;
                background:#0f172a;padding:8px 12px;border-radius:8px;
                border:1px solid #1e293b;margin:0 0 24px 0;">
        {reset_link}
      </p>
      <div style="background:#451a03;border:1px solid #92400e;
                  border-radius:10px;padding:12px 16px;">
        <p style="color:#fcd34d;font-size:12px;margin:0;font-weight:600;">
          ⏰ This link expires in 1 hour.
        </p>
      </div>
    </div>
    <p style="color:#334155;font-size:11px;text-align:center;margin-top:24px;">
      If you did not request this, ignore this email — your account is safe.<br/>
      AI Trading Copilot · Educational purposes only
    </p>
  </div>
</body>
</html>
"""

    text_body = f"""Hi,

You requested a password reset for your AI Trading Copilot account.

Reset your password here:
{reset_link}

This link expires in 1 hour.

If you did not request this, ignore this email.

— AI Trading Copilot Team
"""

    payload = {
        "from":    "AI Trading Copilot <onboarding@resend.dev>",
        "to":      [to_email],
        "subject": "Reset your AI Trading Copilot password",
        "html":    html_body,
        "text":    text_body,
    }

    try:
        with httpx.Client(timeout=15) as client:
            resp = client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type":  "application/json",
                },
            )
        if resp.status_code in (200, 201):
            logger.info(f"[EMAIL] Reset email sent to {to_email} via Resend")
        else:
            logger.error(f"[EMAIL] Resend API error {resp.status_code}: {resp.text}")
            raise Exception(f"Resend API returned {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"[EMAIL] Failed to send reset email: {e}")
        raise


# ── Auth routes ───────────────────────────────────────────────────────────────

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
    token = create_access_token(str(current_user.id))
    return TokenResponse(access_token=token)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    payload: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Generate reset token and send email via Gmail SMTP."""
    # Always return same message — don't reveal if email exists
    SAFE_MSG = "If that email is registered, a reset link has been sent."

    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        return MessageResponse(message=SAFE_MSG)

    token = secrets.token_hex(32)
    user.reset_token        = token
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()
    logger.info(f"[RESET] Token generated for {user.email}")

    reset_link = f"{settings.frontend_url}/reset-password?token={token}"

    # Send email in background — don't block the response
    background_tasks.add_task(_send_reset_email_resend, user.email, reset_link)

    return MessageResponse(message=SAFE_MSG)


@router.get("/verify-reset-token/{token}")
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    """Check if a reset token is valid."""
    clean = token.strip()
    user  = db.query(User).filter(User.reset_token == clean).first()
    if not user:
        return {"valid": False, "reason": "token not found"}
    now    = datetime.now(timezone.utc)
    expiry = user.reset_token_expiry
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    expired = now > expiry if expiry else True
    return {"valid": not expired, "email": user.email, "expired": expired}


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verify token and set new password."""
    clean_token = payload.token.strip()
    logger.info(f"[RESET] Token received len={len(clean_token)} prefix={clean_token[:16]}")

    user = db.query(User).filter(User.reset_token == clean_token).first()
    if not user or user.reset_token_expiry is None:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    now    = datetime.now(timezone.utc)
    expiry = user.reset_token_expiry
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if now > expiry:
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")

    user.password_hash      = get_password_hash(payload.new_password)
    user.reset_token        = None
    user.reset_token_expiry = None
    db.commit()

    logger.info(f"[RESET] Password reset successful for {user.email}")
    return MessageResponse(message="Password reset successfully. You can now log in.")
