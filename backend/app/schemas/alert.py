from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class AlertCondition(str, Enum):
    above = "above"
    below = "below"


class AlertCreate(BaseModel):
    symbol: str
    condition: AlertCondition
    target_price: float = Field(gt=0)


class AlertResponse(BaseModel):
    id: str
    symbol: str
    condition: AlertCondition
    target_price: float
    is_triggered: bool
    is_active: bool
    triggered_at: datetime | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class AlertListResponse(BaseModel):
    alerts: list[AlertResponse]
    total: int
