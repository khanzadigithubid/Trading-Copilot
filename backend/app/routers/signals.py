from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.signal import SignalHistoryResponse, SignalResponse
from app.services.signal_engine import signal_engine

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("/{symbol}", response_model=SignalResponse)
async def get_latest_signal(
    symbol: str,
    refresh: bool = Query(default=False, description="Force regenerate signal"),
    db: Session = Depends(get_db),
):
    try:
        return await signal_engine.get_latest_signal(symbol, db, force_refresh=refresh)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{symbol}/history", response_model=SignalHistoryResponse)
async def get_signal_history(
    symbol: str,
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    try:
        return await signal_engine.get_signal_history(symbol, db, limit=limit)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
