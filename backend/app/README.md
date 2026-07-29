# 📦 App Package

This is the main FastAPI application package.

## Entry Point

`main.py` — Creates the FastAPI app, sets up CORS, registers all routers, runs database migrations on startup.

## Packages

| Package | What it does |
|---|---|
| `core/` | Configuration, database connection, JWT security |
| `models/` | Database table definitions |
| `schemas/` | Data validation shapes for requests and responses |
| `routers/` | API endpoint handlers |
| `services/` | Business logic (AI, trading, market data) |

## How a Request Flows

```
HTTP Request
    ↓
Router (routers/)       ← validates input using schemas/
    ↓
Service (services/)     ← business logic
    ↓
Model (models/)         ← database read/write
    ↓
HTTP Response           ← formatted using schemas/
```
