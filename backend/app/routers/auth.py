from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister, UserResponse, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
from app.services.auth_service import get_current_user
from app.core.config import settings

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

    # Generate secure token
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    db.commit()

    # Build reset link
    frontend_url = settings.frontend_url or "https://kw-trading-copilot.vercel.app"
    reset_link = f"{frontend_url}/reset-password?token={token}"

    # Send email via Web3Forms
    import httpx
    try:
        httpx.post(
            "https://api.web3forms.com/submit",
            json={
                "access_key": settings.web3forms_key,
                "subject": "Reset your AI Trading Copilot password",
                "from_name": "AI Trading Copilot",
                "email": user.email,
                "message": f"Click the link below to reset your password (expires in 1 hour):\n\n{reset_link}\n\nIf you did not request this, ignore this email.",
            },
            timeout=10,
        )
    except Exception as e:
        import logging
        logging.warning(f"[RESET] Email send failed: {e}")

    return MessageResponse(message="If that email exists, a reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Verify token and set new password."""
    user = db.query(User).filter(User.reset_token == payload.token).first()

    if not user or user.reset_token_expiry is None:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    # Check expiry
    now = datetime.now(timezone.utc)
    expiry = user.reset_token_expiry
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if now > expiry:
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")

    # Set new password and clear token
    user.password_hash = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()

    return MessageResponse(message="Password reset successfully. You can now log in.")
