"""
Admin stats endpoint — only accessible by the configured ADMIN_EMAIL.
"""
from collections import Counter
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.community_signal import CommunitySignal
from app.models.signal import Signal
from app.models.trade import Trade
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])


class RecentUser(BaseModel):
    email: str
    joined: str
    trade_count: int
    signal_count: int


class AdminStats(BaseModel):
    # Users
    total_users: int
    new_today: int
    new_this_week: int
    new_this_month: int
    recent_users: list[RecentUser]

    # Activity
    total_trades: int
    total_signals: int
    total_community_signals: int
    open_trades: int
    closed_trades: int

    # Top assets
    top_assets_traded: list[dict]
    top_assets_signaled: list[dict]

    # Time
    generated_at: str


def _require_admin(current_user: User = Depends(get_current_user)):
    if not settings.admin_email:
        raise HTTPException(status_code=403, detail="Admin not configured")
    if current_user.email.lower() != settings.admin_email.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    _admin: User = Depends(_require_admin),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    today = now - timedelta(days=1)
    week = now - timedelta(days=7)
    month = now - timedelta(days=30)

    # Users
    all_users = db.query(User).order_by(User.created_at.desc()).all()
    total_users = len(all_users)
    new_today = sum(1 for u in all_users if u.created_at and u.created_at.replace(tzinfo=timezone.utc) >= today)
    new_week = sum(1 for u in all_users if u.created_at and u.created_at.replace(tzinfo=timezone.utc) >= week)
    new_month = sum(1 for u in all_users if u.created_at and u.created_at.replace(tzinfo=timezone.utc) >= month)

    # Recent users with activity counts
    recent_users = []
    for u in all_users[:10]:
        trade_count = db.query(Trade).filter(Trade.user_id == u.id).count()
        signal_count = db.query(CommunitySignal).filter(CommunitySignal.user_id == u.id).count()
        recent_users.append(RecentUser(
            email=_mask(u.email),
            joined=u.created_at.strftime("%Y-%m-%d %H:%M") if u.created_at else "",
            trade_count=trade_count,
            signal_count=signal_count,
        ))

    # Trades
    all_trades = db.query(Trade).all()
    total_trades = len(all_trades)
    open_trades = sum(1 for t in all_trades if t.status == "open")
    closed_trades = sum(1 for t in all_trades if t.status == "closed")

    # Signals
    total_signals = db.query(Signal).count()
    total_community = db.query(CommunitySignal).count()

    # Top assets traded
    from app.models.asset import Asset
    trade_asset_counts: Counter = Counter()
    for t in all_trades:
        asset = db.query(Asset).filter(Asset.id == t.asset_id).first()
        if asset:
            trade_asset_counts[asset.symbol] += 1

    top_traded = [
        {"symbol": sym, "count": count}
        for sym, count in trade_asset_counts.most_common(5)
    ]

    # Top assets signaled
    signal_asset_counts: Counter = Counter()
    for s in db.query(Signal).all():
        asset = db.query(Asset).filter(Asset.id == s.asset_id).first()
        if asset:
            signal_asset_counts[asset.symbol] += 1

    top_signaled = [
        {"symbol": sym, "count": count}
        for sym, count in signal_asset_counts.most_common(5)
    ]

    return AdminStats(
        total_users=total_users,
        new_today=new_today,
        new_this_week=new_week,
        new_this_month=new_month,
        recent_users=recent_users,
        total_trades=total_trades,
        total_signals=total_signals,
        total_community_signals=total_community,
        open_trades=open_trades,
        closed_trades=closed_trades,
        top_assets_traded=top_traded,
        top_assets_signaled=top_signaled,
        generated_at=now.isoformat(),
    )


def _mask(email: str) -> str:
    """Show full email to admin — they own the platform."""
    return email
