"""
Admin stats endpoint — only accessible by the configured ADMIN_EMAIL.
All stats use aggregated queries — no N+1 loops.
"""
from collections import Counter
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.asset import Asset
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

    # ── Users (single query) ─────────────────────────────────────────────────
    all_users = db.query(User).order_by(User.created_at.desc()).all()
    total_users = len(all_users)

    def _aware(dt: datetime) -> datetime:
        return dt.replace(tzinfo=timezone.utc) if dt and dt.tzinfo is None else dt

    new_today = sum(1 for u in all_users if u.created_at and _aware(u.created_at) >= today)
    new_week  = sum(1 for u in all_users if u.created_at and _aware(u.created_at) >= week)
    new_month = sum(1 for u in all_users if u.created_at and _aware(u.created_at) >= month)

    # ── Trade counts per user (single query) ─────────────────────────────────
    trade_counts_raw = (
        db.query(Trade.user_id, func.count(Trade.id).label("cnt"))
        .group_by(Trade.user_id)
        .all()
    )
    trade_counts = {str(row.user_id): row.cnt for row in trade_counts_raw}

    # ── Community signal counts per user (single query) ───────────────────────
    signal_counts_raw = (
        db.query(CommunitySignal.user_id, func.count(CommunitySignal.id).label("cnt"))
        .group_by(CommunitySignal.user_id)
        .all()
    )
    signal_counts = {str(row.user_id): row.cnt for row in signal_counts_raw}

    # ── Recent users (top 10) ─────────────────────────────────────────────────
    recent_users = []
    for u in all_users[:10]:
        uid = str(u.id)
        recent_users.append(RecentUser(
            email=u.email,  # admin sees full email — they own the platform
            joined=u.created_at.strftime("%Y-%m-%d %H:%M") if u.created_at else "",
            trade_count=trade_counts.get(uid, 0),
            signal_count=signal_counts.get(uid, 0),
        ))

    # ── Trade aggregates (single query each) ──────────────────────────────────
    total_trades  = db.query(func.count(Trade.id)).scalar() or 0
    open_trades   = db.query(func.count(Trade.id)).filter(Trade.status == "open").scalar() or 0
    closed_trades = db.query(func.count(Trade.id)).filter(Trade.status == "closed").scalar() or 0

    # ── Signal aggregates ─────────────────────────────────────────────────────
    total_signals    = db.query(func.count(Signal.id)).scalar() or 0
    total_community  = db.query(func.count(CommunitySignal.id)).scalar() or 0

    # ── Top traded assets (join + group) ──────────────────────────────────────
    top_traded_raw = (
        db.query(Asset.symbol, func.count(Trade.id).label("cnt"))
        .join(Trade, Trade.asset_id == Asset.id)
        .group_by(Asset.symbol)
        .order_by(func.count(Trade.id).desc())
        .limit(5)
        .all()
    )
    top_traded = [{"symbol": row.symbol, "count": row.cnt} for row in top_traded_raw]

    # ── Top signaled assets (join + group) ────────────────────────────────────
    top_signaled_raw = (
        db.query(Asset.symbol, func.count(Signal.id).label("cnt"))
        .join(Signal, Signal.asset_id == Asset.id)
        .group_by(Asset.symbol)
        .order_by(func.count(Signal.id).desc())
        .limit(5)
        .all()
    )
    top_signaled = [{"symbol": row.symbol, "count": row.cnt} for row in top_signaled_raw]

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
