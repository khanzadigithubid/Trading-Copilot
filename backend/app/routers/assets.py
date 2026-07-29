from fastapi import APIRouter, HTTPException, Query

from app.core.database import SessionLocal
from app.models.asset import Asset
from app.schemas.asset import AssetResponse, HistoryRange, HistoryResponse, MarketType, PriceResponse
from app.services.market_data import aggregator
from app.services.market_data.catalog import list_assets

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetResponse])
async def get_assets(
    market: MarketType | None = Query(default=None, description="Filter by market type"),
):
    db = SessionLocal()
    try:
        query = db.query(Asset)
        if market:
            query = query.filter(Asset.market_type == market.value)
        rows = query.order_by(Asset.market_type, Asset.symbol).all()
        if rows:
            return [
                AssetResponse(
                    id=str(row.id),
                    symbol=row.symbol,
                    market_type=MarketType(row.market_type),
                    name=row.name,
                )
                for row in rows
            ]
    finally:
        db.close()

    # Fallback to in-memory catalog when DB has no seeded rows
    catalog = list_assets(market)
    return [
        AssetResponse(symbol=asset.symbol, market_type=asset.market_type, name=asset.name)
        for asset in catalog
    ]


@router.get("/{symbol}/price", response_model=PriceResponse)
async def get_asset_price(symbol: str):
    try:
        return await aggregator.get_price(symbol)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{symbol}/history", response_model=HistoryResponse)
async def get_asset_history(
    symbol: str,
    history_range: HistoryRange = Query(default=HistoryRange.d1, alias="range"),
):
    try:
        return await aggregator.get_history(symbol, history_range)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
