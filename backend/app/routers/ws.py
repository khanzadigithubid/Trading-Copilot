import asyncio
import json
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.schemas.asset import PriceUpdate
from app.services.market_data import aggregator

router = APIRouter(tags=["websocket"])


class PriceStreamManager:
    def __init__(self) -> None:
        self.connections: dict[WebSocket, set[str]] = {}
        self._task: asyncio.Task | None = None

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[websocket] = set()
        if self._task is None or self._task.done():
            self._task = asyncio.create_task(self._broadcast_loop())

    def disconnect(self, websocket: WebSocket) -> None:
        self.connections.pop(websocket, None)
        if not self.connections and self._task and not self._task.done():
            self._task.cancel()

    def subscribe(self, websocket: WebSocket, symbols: list[str]) -> None:
        normalized = {symbol.upper() for symbol in symbols}
        self.connections[websocket] = normalized

    async def _broadcast_loop(self) -> None:
        while self.connections:
            all_symbols: set[str] = set()
            for symbols in self.connections.values():
                all_symbols.update(symbols)

            if all_symbols:
                prices = await aggregator.get_prices(sorted(all_symbols))
                payload = [PriceUpdate(**price.model_dump()).model_dump(mode="json") for price in prices]
                stale: list[WebSocket] = []

                for websocket, symbols in list(self.connections.items()):
                    if not symbols:
                        continue
                    relevant = [item for item in payload if item["symbol"] in symbols]
                    if not relevant:
                        continue
                    try:
                        await websocket.send_text(json.dumps({"type": "prices", "data": relevant}))
                    except Exception:
                        stale.append(websocket)

                for websocket in stale:
                    self.disconnect(websocket)

            await asyncio.sleep(5)

    async def handle(self, websocket: WebSocket) -> None:
        await self.connect(websocket)
        try:
            while True:
                raw = await websocket.receive_text()
                try:
                    message: dict[str, Any] = json.loads(raw)
                except json.JSONDecodeError:
                    await websocket.send_text(json.dumps({"type": "error", "message": "Invalid JSON"}))
                    continue

                action = message.get("action", "subscribe")
                symbols = message.get("symbols", [])
                if action == "subscribe" and isinstance(symbols, list):
                    self.subscribe(websocket, symbols)
                    await websocket.send_text(
                        json.dumps({"type": "subscribed", "symbols": [s.upper() for s in symbols]})
                    )
                else:
                    await websocket.send_text(json.dumps({"type": "error", "message": "Unknown action"}))
        except WebSocketDisconnect:
            self.disconnect(websocket)


manager = PriceStreamManager()


@router.websocket("/ws/prices")
async def prices_websocket(websocket: WebSocket):
    await manager.handle(websocket)
