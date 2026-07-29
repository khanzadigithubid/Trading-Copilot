import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.alert import PriceAlert
from app.models.user import User
from app.schemas.alert import AlertCondition, AlertCreate, AlertListResponse, AlertResponse
from app.services.auth_service import get_current_user
from app.services.market_data import aggregator

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    payload: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    alert = PriceAlert(
        user_id=current_user.id,
        symbol=payload.symbol.upper(),
        condition=payload.condition.value,
        target_price=payload.target_price,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return _to_response(alert)


@router.get("", response_model=AlertListResponse)
def list_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(PriceAlert)
        .filter(PriceAlert.user_id == current_user.id)
        .order_by(PriceAlert.created_at.desc())
        .all()
    )
    return AlertListResponse(alerts=[_to_response(r) for r in rows], total=len(rows))


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        alert_uuid = uuid.UUID(alert_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid alert ID") from exc

    alert = db.query(PriceAlert).filter(
        PriceAlert.id == alert_uuid,
        PriceAlert.user_id == current_user.id,
    ).first()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()


@router.post("/check", response_model=AlertListResponse)
async def check_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check all active alerts against current prices and trigger matched ones."""
    active = (
        db.query(PriceAlert)
        .filter(PriceAlert.user_id == current_user.id, PriceAlert.is_active == True)  # noqa: E712
        .all()
    )

    triggered: list[PriceAlert] = []
    symbols = list({a.symbol for a in active})

    prices: dict[str, float] = {}
    for sym in symbols:
        try:
            p = await aggregator.get_price(sym)
            prices[sym] = p.price
        except Exception:
            pass

    for alert in active:
        price = prices.get(alert.symbol)
        if price is None:
            continue
        hit = (
            (alert.condition == AlertCondition.above.value and price >= alert.target_price)
            or (alert.condition == AlertCondition.below.value and price <= alert.target_price)
        )
        if hit and not alert.is_triggered:
            alert.is_triggered = True
            alert.triggered_at = datetime.now(timezone.utc)
            triggered.append(alert)

    if triggered:
        db.commit()

    all_rows = (
        db.query(PriceAlert)
        .filter(PriceAlert.user_id == current_user.id)
        .order_by(PriceAlert.created_at.desc())
        .all()
    )
    return AlertListResponse(alerts=[_to_response(r) for r in all_rows], total=len(all_rows))


def _to_response(alert: PriceAlert) -> AlertResponse:
    return AlertResponse(
        id=str(alert.id),
        symbol=alert.symbol,
        condition=AlertCondition(alert.condition),
        target_price=alert.target_price,
        is_triggered=alert.is_triggered,
        is_active=alert.is_active,
        triggered_at=alert.triggered_at,
        created_at=alert.created_at,
    )
