"""
SL/TP background monitor.
Runs every 30 seconds, checks all open paper trades that have a stop_loss
or take_profit set, fetches current price, and auto-closes triggered ones.
"""
import asyncio
import logging
from datetime import datetime, timezone

from app.core.database import SessionLocal
from app.models.asset import Asset
from app.models.trade import Trade

logger = logging.getLogger(__name__)

_POLL_INTERVAL = 30  # seconds
_monitor_task: asyncio.Task | None = None


async def _check_and_close() -> None:
    """Single pass: fetch open trades with SL/TP, check prices, close triggered ones."""
    from app.services.market_data import aggregator  # local import avoids circular

    db = SessionLocal()
    try:
        # All open paper trades that have at least one of SL or TP set
        rows = (
            db.query(Trade, Asset)
            .join(Asset, Trade.asset_id == Asset.id)
            .filter(
                Trade.status == "open",
                Trade.is_paper == True,  # noqa: E712
                (Trade.stop_loss.isnot(None)) | (Trade.take_profit.isnot(None)),
            )
            .all()
        )
    finally:
        db.close()

    if not rows:
        return

    # Collect unique symbols and fetch prices in one batch
    symbols = list({asset.symbol for _, asset in rows})
    price_map: dict[str, float] = {}
    try:
        prices = await aggregator.get_prices(symbols)
        price_map = {p.symbol: p.price for p in prices}
    except Exception as exc:
        logger.warning("[SLTP] Failed to fetch prices: %s", exc)
        return

    closed_count = 0
    db = SessionLocal()
    try:
        for trade, asset in rows:
            price = price_map.get(asset.symbol)
            if price is None:
                continue

            triggered = False
            trigger_reason = ""

            sl = trade.stop_loss
            tp = trade.take_profit
            is_buy = trade.type == "buy"

            if is_buy:
                if sl is not None and price <= sl:
                    triggered = True
                    trigger_reason = f"SL hit ({price:.6g} <= {sl:.6g})"
                elif tp is not None and price >= tp:
                    triggered = True
                    trigger_reason = f"TP hit ({price:.6g} >= {tp:.6g})"
            else:  # sell / short
                if sl is not None and price >= sl:
                    triggered = True
                    trigger_reason = f"SL hit ({price:.6g} >= {sl:.6g})"
                elif tp is not None and price <= tp:
                    triggered = True
                    trigger_reason = f"TP hit ({price:.6g} <= {tp:.6g})"

            if triggered:
                # Re-fetch the trade inside this session to avoid DetachedInstanceError
                live_trade = db.query(Trade).filter(Trade.id == trade.id).first()
                if live_trade and live_trade.status == "open":
                    live_trade.exit_price = price
                    live_trade.status = "closed"
                    live_trade.closed_at = datetime.now(timezone.utc)
                    db.commit()
                    closed_count += 1
                    logger.info(
                        "[SLTP] Auto-closed trade %s (%s %s) — %s",
                        trade.id, trade.type, asset.symbol, trigger_reason,
                    )
    finally:
        db.close()

    if closed_count:
        logger.info("[SLTP] Closed %d trade(s) this pass.", closed_count)


async def _monitor_loop() -> None:
    """Infinite loop — runs _check_and_close every _POLL_INTERVAL seconds."""
    logger.info("[SLTP] Monitor started (interval=%ds)", _POLL_INTERVAL)
    while True:
        try:
            await _check_and_close()
        except Exception as exc:
            logger.warning("[SLTP] Unexpected error in monitor pass: %s", exc)
        await asyncio.sleep(_POLL_INTERVAL)


def start_monitor() -> None:
    """Create and store the background monitor task. Call once at app startup."""
    global _monitor_task
    if _monitor_task is None or _monitor_task.done():
        _monitor_task = asyncio.create_task(_monitor_loop())
        logger.info("[SLTP] Background task created.")


def stop_monitor() -> None:
    """Cancel the monitor task. Call at app shutdown."""
    global _monitor_task
    if _monitor_task and not _monitor_task.done():
        _monitor_task.cancel()
        logger.info("[SLTP] Background task cancelled.")
