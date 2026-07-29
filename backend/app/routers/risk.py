import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.risk import PositionSizeResponse, UserRiskSummary
from app.services.auth_service import get_current_user
from app.services.risk_manager import risk_manager

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/position-size", response_model=PositionSizeResponse)
def get_position_size(
    symbol: str = Query(..., description="Asset symbol e.g. EURUSD"),
    entry: float = Query(..., gt=0),
    stop_loss: float = Query(..., gt=0),
    current_user: User = Depends(get_current_user),
):
    try:
        return risk_manager.calculate_position_size(
            symbol=symbol,
            entry=entry,
            stop_loss=stop_loss,
            capital=current_user.capital,
            risk_tolerance_pct=current_user.risk_tolerance,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/me", response_model=UserRiskSummary)
def get_my_risk_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return risk_manager.get_user_summary(current_user, db)


@router.get("/user-summary/{user_id}", response_model=UserRiskSummary)
def get_user_risk_summary(
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

    return risk_manager.get_user_summary(current_user, db)
