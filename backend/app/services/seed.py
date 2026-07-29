from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.services.market_data.catalog import DEFAULT_ASSETS


def seed_assets(db: Session) -> None:
    """Upsert all catalog assets so new additions are picked up on restart."""
    existing_symbols: set[str] = {
        row.symbol for row in db.query(Asset.symbol).all()
    }

    new_assets = [
        Asset(
            symbol=definition.symbol,
            market_type=definition.market_type.value,
            name=definition.name,
        )
        for definition in DEFAULT_ASSETS
        if definition.symbol not in existing_symbols
    ]

    if new_assets:
        db.add_all(new_assets)
        db.commit()
