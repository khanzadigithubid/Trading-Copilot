from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import Depends

from app.core.database import get_db
from app.models.community_signal import CommunitySignal
from app.models.trade import Trade
from app.models.user import User

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


class LeaderEntry(BaseModel):
    rank: int
    email: str
    total_signals: int
    total_upvotes: int
    win_rate: float
    total_pnl: float
    best_trade: float
    joined: str


class LeaderboardResponse(BaseModel):
    leaders: list[LeaderEntry]
    total_users: int
    total_signals: int
    total_trades: int


def _mask_email(email: str) -> str:
    parts = email.split("@")
    if len(parts) != 2:
        return "trader"
    name, domain = parts
    masked = name[:2] + "***" if len(name) > 2 else name
    return f"{masked}@{domain}"


@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    # ── Single query: per-user signal counts + upvote totals ──────────────────
    signal_stats = (
        db.query(
            CommunitySignal.user_id,
            func.count(CommunitySignal.id).label("total_signals"),
            func.coalesce(func.sum(CommunitySignal.upvotes), 0).label("total_upvotes"),
        )
        .group_by(CommunitySignal.user_id)
        .all()
    )
    sig_map: dict = {str(row.user_id): (row.total_signals, row.total_upvotes) for row in signal_stats}

    # ── Single query: all closed trades with user_id ──────────────────────────
    closed_trades = (
        db.query(Trade)
        .filter(
            Trade.status == "closed",
            Trade.entry_price.isnot(None),
            Trade.exit_price.isnot(None),
            Trade.size.isnot(None),
        )
        .all()
    )

    # Group trades by user
    from collections import defaultdict
    trade_map: dict[str, list[float]] = defaultdict(list)
    for t in closed_trades:
        pnl = (
            (t.exit_price - t.entry_price) * t.size
            if (t.type or "").upper() == "BUY"
            else (t.entry_price - t.exit_price) * t.size
        )
        trade_map[str(t.user_id)].append(pnl)

    # ── Single query: all users ───────────────────────────────────────────────
    users = db.query(User).all()

    entries: list[LeaderEntry] = []
    for user in users:
        uid = str(user.id)
        total_signals, total_upvotes = sig_map.get(uid, (0, 0))
        pnls = trade_map.get(uid, [])

        # Skip users with no activity
        if total_signals == 0 and not pnls:
            continue

        total_pnl = round(sum(pnls), 2)
        best_trade = round(max(pnls), 2) if pnls else 0.0
        wins = sum(1 for p in pnls if p > 0)
        win_rate = round((wins / len(pnls) * 100) if pnls else 0, 1)

        entries.append(LeaderEntry(
            rank=0,
            email=_mask_email(user.email),
            total_signals=total_signals,
            total_upvotes=total_upvotes,
            win_rate=win_rate,
            total_pnl=total_pnl,
            best_trade=best_trade,
            joined=user.created_at.isoformat(),
        ))

    # Sort by upvotes desc, then signals desc
    entries.sort(key=lambda e: (e.total_upvotes, e.total_signals), reverse=True)
    for i, e in enumerate(entries):
        e.rank = i + 1

    total_signals_db = db.query(func.count(CommunitySignal.id)).scalar() or 0
    total_trades_db = db.query(func.count(Trade.id)).scalar() or 0
    total_users_db = db.query(func.count(User.id)).scalar() or 0

    return LeaderboardResponse(
        leaders=entries[:50],
        total_users=total_users_db,
        total_signals=total_signals_db,
        total_trades=total_trades_db,
    )
