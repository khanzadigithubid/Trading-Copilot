from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.services.market_data.catalog import DEFAULT_ASSETS

# Symbols that were renamed — old_symbol: new_symbol
# Seed will update existing rows instead of inserting duplicates
_RENAMES: dict[str, str] = {
    "BRK.B": "BRKB",   # dot causes URL routing issues
}


def seed_assets(db: Session) -> None:
    """Upsert all catalog assets so new additions are picked up on restart."""

    # 1. Apply renames — update old symbols in-place
    for old_sym, new_sym in _RENAMES.items():
        old_row = db.query(Asset).filter(Asset.symbol == old_sym).first()
        if old_row:
            # Check new symbol doesn't already exist
            new_exists = db.query(Asset).filter(Asset.symbol == new_sym).first()
            if not new_exists:
                old_row.symbol = new_sym
                db.commit()

    # 2. Upsert new assets
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
