import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.trade import PaperTradeOpenRequest, TradeCloseRequest, TradeListResponse, TradeResponse
from app.services.auth_service import get_current_user
from app.services.paper_trading import paper_trading_service

router = APIRouter(prefix="/trades", tags=["trades"])


@router.post("/paper", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
async def open_paper_trade(
    payload: PaperTradeOpenRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return await paper_trading_service.open_paper_trade(current_user, payload, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/me", response_model=TradeListResponse)
def get_my_trades(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return paper_trading_service.list_user_trades(current_user, db)


@router.get("/user/{user_id}", response_model=TradeListResponse)
def get_user_trades(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        target_id = uuid.UUID(user_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid user ID") from exc

    if target_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return paper_trading_service.list_user_trades(current_user, db)


@router.post("/{trade_id}/close", response_model=TradeResponse)
async def close_trade(
    trade_id: str,
    payload: TradeCloseRequest = TradeCloseRequest(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return await paper_trading_service.close_trade(current_user, trade_id, payload, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
