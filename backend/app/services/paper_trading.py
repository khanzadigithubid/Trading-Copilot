import uuid

from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.trade import Trade
from app.models.user import User
from app.schemas.trade import (
    PaperTradeOpenRequest,
    TradeCloseRequest,
    TradeListResponse,
    TradeResponse,
    TradeStatus,
    TradeType,
)
from app.services.market_data import aggregator
from app.services.market_data.catalog import get_asset


class PaperTradingService:
    def _resolve_asset(self, symbol: str, db: Session) -> Asset:
        asset_def = get_asset(symbol)
        if asset_def is None:
            raise ValueError(f"Unknown asset symbol: {symbol}")

        db_asset = db.query(Asset).filter(Asset.symbol == asset_def.symbol.upper()).first()
        if db_asset is None:
            db_asset = Asset(
                symbol=asset_def.symbol,
                market_type=asset_def.market_type.value,
                name=asset_def.name,
            )
            db.add(db_asset)
            db.flush()
        return db_asset

    async def open_paper_trade(
        self, user: User, payload: PaperTradeOpenRequest, db: Session
    ) -> TradeResponse:
        db_asset = self._resolve_asset(payload.symbol, db)

        entry_price = payload.entry_price
        if entry_price is None:
            price_data = await aggregator.get_price(payload.symbol)
            entry_price = price_data.price

        trade = Trade(
            user_id=user.id,
            asset_id=db_asset.id,
            type=payload.type.value,
            entry_price=entry_price,
            size=payload.size,
            status=TradeStatus.open.value,
            is_paper=True,
        )
        db.add(trade)
        db.commit()
        db.refresh(trade)
        return self._to_response(trade, db_asset)

    async def close_trade(
        self, user: User, trade_id: str, payload: TradeCloseRequest, db: Session
    ) -> TradeResponse:
        try:
            trade_uuid = uuid.UUID(trade_id)
        except ValueError as exc:
            raise ValueError("Invalid trade ID") from exc

        trade = db.query(Trade).filter(Trade.id == trade_uuid, Trade.user_id == user.id).first()
        if trade is None:
            raise ValueError("Trade not found")
        if trade.status == TradeStatus.closed.value:
            raise ValueError("Trade is already closed")

        db_asset = db.query(Asset).filter(Asset.id == trade.asset_id).first()
        if db_asset is None:
            raise ValueError("Asset not found")

        exit_price = payload.exit_price
        if exit_price is None:
            price_data = await aggregator.get_price(db_asset.symbol)
            exit_price = price_data.price

        trade.exit_price = exit_price
        trade.status = TradeStatus.closed.value
        db.commit()
        db.refresh(trade)
        return self._to_response(trade, db_asset)

    def list_user_trades(self, user: User, db: Session) -> TradeListResponse:
        rows = (
            db.query(Trade, Asset)
            .join(Asset, Trade.asset_id == Asset.id)
            .filter(Trade.user_id == user.id)
            .order_by(Trade.created_at.desc())
            .all()
        )

        trades: list[TradeResponse] = []
        total_realized = 0.0
        open_count = 0
        closed_count = 0

        for trade, asset in rows:
            response = self._to_response(trade, asset)
            trades.append(response)
            if trade.status == TradeStatus.open.value:
                open_count += 1
            else:
                closed_count += 1
                if response.pnl is not None:
                    total_realized += response.pnl

        return TradeListResponse(
            user_id=str(user.id),
            trades=trades,
            open_count=open_count,
            closed_count=closed_count,
            total_realized_pnl=round(total_realized, 2),
        )

    def _to_response(self, trade: Trade, asset: Asset) -> TradeResponse:
        pnl = None
        pnl_percent = None

        if trade.status == TradeStatus.closed.value and trade.entry_price and trade.exit_price and trade.size:
            if trade.type == TradeType.buy.value:
                pnl = (trade.exit_price - trade.entry_price) * trade.size
            else:
                pnl = (trade.entry_price - trade.exit_price) * trade.size
            pnl = round(pnl, 2)
            cost_basis = trade.entry_price * trade.size
            if cost_basis > 0:
                pnl_percent = round((pnl / cost_basis) * 100, 2)

        return TradeResponse(
            id=str(trade.id),
            user_id=str(trade.user_id),
            symbol=asset.symbol,
            market_type=asset.market_type,
            type=TradeType(trade.type) if trade.type else TradeType.buy,
            entry_price=trade.entry_price or 0,
            exit_price=trade.exit_price,
            size=trade.size or 0,
            status=TradeStatus(trade.status) if trade.status else TradeStatus.open,
            is_paper=trade.is_paper,
            pnl=pnl,
            pnl_percent=pnl_percent,
            created_at=trade.created_at,
        )


paper_trading_service = PaperTradingService()
