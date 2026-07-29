from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.core.database import SessionLocal
import app.models  # noqa: F401 — ensure all models are registered with Base before create_all
from app.routers import assets, auth, backtest, chat, risk, signals, trades, ws
from app.routers import alerts as alerts_router
from app.routers import portfolio as portfolio_router
from app.routers import journal as journal_router
from app.routers import mtf as mtf_router
from app.routers import sentiment as sentiment_router
from app.routers import community as community_router
from app.services.seed import seed_assets


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_assets(db)
    finally:
        db.close()
    yield
    # Shutdown (nothing needed yet)


app = FastAPI(title=settings.app_name, version="0.5.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(signals.router)
app.include_router(risk.router)
app.include_router(chat.router)
app.include_router(trades.router)
app.include_router(backtest.router)
app.include_router(ws.router)
app.include_router(alerts_router.router)
app.include_router(portfolio_router.router)
app.include_router(journal_router.router)
app.include_router(mtf_router.router)
app.include_router(sentiment_router.router)
app.include_router(community_router.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}
