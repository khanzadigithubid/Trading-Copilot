import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.community_signal import CommunitySignal, CommunityVote
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/community", tags=["community"])


# ── Schemas ──────────────────────────────────────────────────────────────────

class CommunitySignalCreate(BaseModel):
    symbol: str
    signal: str = Field(pattern="^(BUY|SELL|HOLD)$")
    confidence: float = Field(ge=0, le=100)
    reasoning: str = Field(min_length=10, max_length=500)
    timeframe: str = Field(default="1d", pattern="^(1d|1w|1m)$")


class CommunitySignalResponse(BaseModel):
    id: str
    symbol: str
    signal: str
    confidence: float
    reasoning: str
    timeframe: str
    upvotes: int
    author_email: str          # partial — only show first part
    is_own: bool = False       # True if current user is the author
    created_at: str
    voted_by_me: bool = False


class CommunityFeedResponse(BaseModel):
    signals: list[CommunitySignalResponse]
    total: int


# ── Helpers ──────────────────────────────────────────────────────────────────

def _mask_email(email: str) -> str:
    """Show user@... → use***@domain"""
    parts = email.split("@")
    if len(parts) != 2:
        return "trader"
    name, domain = parts
    masked = name[:2] + "***" if len(name) > 2 else name
    return f"{masked}@{domain}"


def _to_response(
    sig: CommunitySignal,
    author_email: str,
    voted_by_me: bool,
    is_own: bool = False,
) -> CommunitySignalResponse:
    return CommunitySignalResponse(
        id=str(sig.id),
        symbol=sig.symbol,
        signal=sig.signal,
        confidence=sig.confidence,
        reasoning=sig.reasoning,
        timeframe=sig.timeframe,
        upvotes=sig.upvotes,
        author_email=_mask_email(author_email),
        is_own=is_own,
        created_at=sig.created_at.isoformat(),
        voted_by_me=voted_by_me,
    )


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/feed", response_model=CommunityFeedResponse)
def get_feed(
    symbol: str | None = Query(default=None),
    signal_type: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(CommunitySignal, User).join(User, CommunitySignal.user_id == User.id)
    if symbol:
        query = query.filter(CommunitySignal.symbol == symbol.upper())
    if signal_type and signal_type in ("BUY", "SELL", "HOLD"):
        query = query.filter(CommunitySignal.signal == signal_type)

    rows = query.order_by(CommunitySignal.upvotes.desc(), CommunitySignal.created_at.desc()).limit(limit).all()

    # Signals user already voted on
    my_votes: set[str] = {
        str(v.signal_id)
        for v in db.query(CommunityVote).filter(CommunityVote.user_id == current_user.id).all()
    }

    signals = [
        _to_response(sig, user.email, str(sig.id) in my_votes, is_own=sig.user_id == current_user.id)
        for sig, user in rows
    ]
    return CommunityFeedResponse(signals=signals, total=len(signals))


@router.post("", response_model=CommunitySignalResponse, status_code=status.HTTP_201_CREATED)
def post_signal(
    payload: CommunitySignalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sig = CommunitySignal(
        user_id=current_user.id,
        symbol=payload.symbol.upper(),
        signal=payload.signal,
        confidence=payload.confidence,
        reasoning=payload.reasoning,
        timeframe=payload.timeframe,
    )
    db.add(sig)
    db.commit()
    db.refresh(sig)
    return _to_response(sig, current_user.email, False, is_own=True)


@router.post("/{signal_id}/vote", response_model=CommunitySignalResponse)
def vote(
    signal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        sig_uuid = uuid.UUID(signal_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid signal ID") from exc

    sig = db.query(CommunitySignal).filter(CommunitySignal.id == sig_uuid).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found")
    if sig.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot vote on your own signal")

    existing = db.query(CommunityVote).filter(
        CommunityVote.signal_id == sig_uuid,
        CommunityVote.user_id == current_user.id,
    ).first()

    if existing:
        # Toggle — remove vote
        db.delete(existing)
        sig.upvotes = max(0, sig.upvotes - 1)
        voted = False
    else:
        db.add(CommunityVote(user_id=current_user.id, signal_id=sig_uuid))
        sig.upvotes += 1
        voted = True

    db.commit()
    db.refresh(sig)

    author = db.query(User).filter(User.id == sig.user_id).first()
    return _to_response(
        sig,
        author.email if author else "unknown",
        voted,
        is_own=(sig.user_id == current_user.id),
    )


@router.delete("/{signal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_signal(
    signal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        sig_uuid = uuid.UUID(signal_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid ID") from exc

    sig = db.query(CommunitySignal).filter(
        CommunitySignal.id == sig_uuid,
        CommunitySignal.user_id == current_user.id,
    ).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found or not yours")

    db.delete(sig)
    db.commit()
