from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.signal import Signal
from app.schemas.asset import HistoryRange
from app.schemas.signal import RiskLevel, SignalAction, SignalHistoryResponse, SignalResponse
from app.services.claude_client import generate_ai_signal
from app.services.indicators import calculate_indicators, summarize_price_action
from app.services.market_data import aggregator
from app.services.market_data.catalog import get_asset


class SignalEngine:
    CACHE_MINUTES = 15

    async def get_latest_signal(self, symbol: str, db: Session, force_refresh: bool = False) -> SignalResponse:
        asset_def = get_asset(symbol)
        if asset_def is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")

        db_asset = db.query(Asset).filter(Asset.symbol == asset_def.symbol.upper()).first()
        if db_asset and not force_refresh:
            cached = self._get_cached_signal(db, db_asset.id)
            if cached:
                return cached

        return await self._generate_and_store(symbol, db, db_asset)

    async def get_signal_history(self, symbol: str, db: Session, limit: int = 20) -> SignalHistoryResponse:
        asset_def = get_asset(symbol)
        if asset_def is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")

        db_asset = db.query(Asset).filter(Asset.symbol == asset_def.symbol.upper()).first()
        if db_asset is None:
            return SignalHistoryResponse(symbol=asset_def.symbol, signals=[])

        rows = (
            db.query(Signal)
            .filter(Signal.asset_id == db_asset.id)
            .order_by(Signal.created_at.desc())
            .limit(limit)
            .all()
        )

        return SignalHistoryResponse(
            symbol=asset_def.symbol,
            signals=[self._to_response(row, asset_def.symbol) for row in rows],
        )

    def _get_cached_signal(self, db: Session, asset_id) -> SignalResponse | None:
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=self.CACHE_MINUTES)
        row = (
            db.query(Signal)
            .filter(Signal.asset_id == asset_id, Signal.created_at >= cutoff)
            .order_by(Signal.created_at.desc())
            .first()
        )
        if row is None:
            return None

        asset = db.query(Asset).filter(Asset.id == asset_id).first()
        symbol = asset.symbol if asset else "UNKNOWN"
        return self._to_response(row, symbol)

    async def _generate_and_store(self, symbol: str, db: Session, db_asset: Asset | None) -> SignalResponse:
        price_data = await aggregator.get_price(symbol)
        history = await aggregator.get_history(symbol, HistoryRange.m1)
        indicators = calculate_indicators(history.bars)

        if indicators is None:
            raise ValueError("Not enough historical data to calculate indicators")

        sentiment_summary = "No recent news sentiment available (NewsAPI not configured)."
        price_action_summary = summarize_price_action(history.bars)

        ai_result = await generate_ai_signal(
            symbol=symbol.upper(),
            price=price_data.price,
            indicators=indicators,
            sentiment_summary=sentiment_summary,
            price_action_summary=price_action_summary,
        )

        if db_asset is None:
            asset_def = get_asset(symbol)
            db_asset = Asset(
                symbol=asset_def.symbol,
                market_type=asset_def.market_type.value,
                name=asset_def.name,
            )
            db.add(db_asset)
            db.flush()

        row = Signal(
            asset_id=db_asset.id,
            signal=ai_result["signal"].value,
            confidence=ai_result["confidence"],
            reasoning=ai_result["reasoning"],
            risk_level=ai_result["risk_level"].value,
        )
        db.add(row)
        db.commit()
        db.refresh(row)

        response = self._to_response(row, db_asset.symbol)
        response.indicators = indicators
        response.source = ai_result.get("source", "ai")
        return response

    def _to_response(self, row: Signal, symbol: str) -> SignalResponse:
        try:
            risk_level = RiskLevel(row.risk_level) if row.risk_level else RiskLevel.low
        except ValueError:
            risk_level = RiskLevel.low

        return SignalResponse(
            id=str(row.id),
            symbol=symbol,
            signal=SignalAction(row.signal) if row.signal else SignalAction.hold,
            confidence=row.confidence or 0,
            reasoning=row.reasoning or "",
            risk_level=risk_level,
            created_at=row.created_at,
        )


signal_engine = SignalEngine()
