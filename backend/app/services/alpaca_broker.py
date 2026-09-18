"""
Alpaca Broker Service — submits paper trades to Alpaca's free paper-trading API.
When ALPACA_API_KEY is set, trades are sent to Alpaca so users see real fills,
position tracking, and account equity — just like a real broker.
Falls back to internal paper trading silently when keys are missing.

Alpaca paper account: https://alpaca.markets (free, instant signup)
"""
import logging
from datetime import datetime, timezone

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# Alpaca paper trading base URL
_BROKER_URL = "https://paper-api.alpaca.markets/v2"


def _headers() -> dict[str, str]:
    return {
        "APCA-API-KEY-ID":     settings.alpaca_api_key,
        "APCA-API-SECRET-KEY": settings.alpaca_secret_key,
        "Content-Type":        "application/json",
    }


def _is_available() -> bool:
    return bool(settings.alpaca_api_key and settings.alpaca_secret_key)


def _alpaca_symbol(symbol: str) -> str:
    """Convert internal symbol to Alpaca order symbol."""
    crypto_map = {
        "BTCUSDT": "BTC/USD",
        "ETHUSDT": "ETH/USD",
        "SOLUSDT": "SOL/USD",
        "LTCUSDT": "LTC/USD",
        "DOGEUSDT": "DOGE/USD",
        "BNBUSDT":  "BNB/USD",
        "XRPUSDT":  "XRP/USD",
        "ADAUSDT":  "ADA/USD",
        "AVAXUSDT": "AVAX/USD",
        "UNIUSDT":  "UNI/USD",
        "LINKUSDT": "LINK/USD",
    }
    return crypto_map.get(symbol.upper(), symbol.upper())


async def submit_paper_order(
    symbol: str,
    side: str,        # "buy" or "sell"
    qty: float,
    stop_loss: float | None = None,
    take_profit: float | None = None,
) -> dict:
    """
    Submit a paper market order to Alpaca.
    Returns the Alpaca order dict, or an empty dict if unavailable.
    """
    if not _is_available():
        return {}

    alpaca_sym = _alpaca_symbol(symbol)

    order_payload: dict = {
        "symbol":        alpaca_sym,
        "qty":           str(qty),
        "side":          side.lower(),
        "type":          "market",
        "time_in_force": "gtc",
    }

    # Bracket order: add SL + TP as legs
    if stop_loss is not None and take_profit is not None:
        order_payload["order_class"] = "bracket"
        order_payload["stop_loss"]   = {"stop_price": str(round(stop_loss, 6))}
        order_payload["take_profit"] = {"limit_price": str(round(take_profit, 6))}
    elif stop_loss is not None:
        order_payload["order_class"] = "oto"
        order_payload["stop_loss"]   = {"stop_price": str(round(stop_loss, 6))}
    elif take_profit is not None:
        order_payload["order_class"] = "oto"
        order_payload["take_profit"] = {"limit_price": str(round(take_profit, 6))}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                f"{_BROKER_URL}/orders",
                headers=_headers(),
                json=order_payload,
            )
            if r.status_code in (200, 201):
                data = r.json()
                logger.info("[ALPACA] Order submitted: %s %s qty=%s id=%s",
                            side, alpaca_sym, qty, data.get("id"))
                return data
            else:
                logger.warning("[ALPACA] Order failed %d: %s", r.status_code, r.text[:200])
                return {}
    except Exception as exc:
        logger.warning("[ALPACA] Order error: %s", exc)
        return {}


async def cancel_alpaca_order(order_id: str) -> bool:
    """Cancel an open Alpaca order by ID."""
    if not _is_available() or not order_id:
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.delete(
                f"{_BROKER_URL}/orders/{order_id}",
                headers=_headers(),
            )
            return r.status_code in (200, 204)
    except Exception:
        return False


async def get_alpaca_account() -> dict:
    """Fetch Alpaca paper account info (equity, buying_power, etc.)."""
    if not _is_available():
        return {}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f"{_BROKER_URL}/account", headers=_headers())
            r.raise_for_status()
            return r.json()
    except Exception as exc:
        logger.warning("[ALPACA] Account fetch error: %s", exc)
        return {}


async def get_alpaca_positions() -> list[dict]:
    """Fetch all open positions from Alpaca paper account."""
    if not _is_available():
        return []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(f"{_BROKER_URL}/positions", headers=_headers())
            r.raise_for_status()
            return r.json()
    except Exception as exc:
        logger.warning("[ALPACA] Positions fetch error: %s", exc)
        return []
