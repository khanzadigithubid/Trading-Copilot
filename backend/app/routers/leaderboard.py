from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.community_signal import CommunitySignal, CommunityVote
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
    users = db.query(User).all()

    entries: list[LeaderEntry] = []

    for user in users:
        # Community signals + upvotes
        signals = db.query(CommunitySignal).filter(CommunitySignal.user_id == user.id).all()
        total_signals = len(signals)
        total_upvotes = sum(s.upvotes for s in signals)

        # Paper trade stats
        closed = [
            t for t in db.query(Trade).filter(
                Trade.user_id == user.id, Trade.status == "closed"
            ).all()
            if t.entry_price and t.exit_price and t.size
        ]

        pnls = []
        for t in closed:
            if (t.type or "").upper() == "BUY":
                pnl = (t.exit_price - t.entry_price) * t.size
            else:
                pnl = (t.entry_price - t.exit_price) * t.size
            pnls.append(pnl)

        total_pnl = round(sum(pnls), 2)
        best_trade = round(max(pnls), 2) if pnls else 0.0
        wins = sum(1 for p in pnls if p > 0)
        win_rate = round((wins / len(pnls) * 100) if pnls else 0, 1)

        # Only include users with at least 1 signal or trade
        if total_signals == 0 and len(closed) == 0:
            continue

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

    # Sort by signals desc
    entries.sort(key=lambda e: (e.total_upvotes, e.total_signals), reverse=True)
    for i, e in enumerate(entries):
        e.rank = i + 1

    total_signals_db = db.query(CommunitySignal).count()
    total_trades_db = db.query(Trade).count()
    total_users_db = db.query(User).count()

    return LeaderboardResponse(
        leaders=entries[:50],
        total_users=total_users_db,
        total_signals=total_signals_db,
        total_trades=total_trades_db,
    )
