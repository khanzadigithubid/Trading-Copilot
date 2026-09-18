import logging
import warnings

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)

_INSECURE_SECRET = "change-me-in-production-use-a-long-random-string"


class Settings(BaseSettings):
    app_name: str = "AI Trading Copilot API"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/trading_copilot"
    secret_key: str = _INSECURE_SECRET
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    cors_origins: str = "http://localhost:3000"

    # Anthropic direct (optional)
    anthropic_api_key: str = ""

    # OpenRouter (free tier — https://openrouter.ai)
    openrouter_api_key: str = ""
    openrouter_model: str = "google/gemma-4-26b-a4b-it:free"

    # Market data APIs
    alpha_vantage_api_key: str = ""
    polygon_api_key: str = ""
    twelve_data_api_key: str = ""
    news_api_key: str = ""

    # Alpaca Markets (free paper trading — https://alpaca.markets)
    alpaca_api_key: str = ""
    alpaca_secret_key: str = ""
    alpaca_base_url: str = "https://paper-api.alpaca.markets"

    # Resend email API (https://resend.com — free 100 emails/day)
    resend_api_key: str = ""
    contact_email: str = ""  # set CONTACT_EMAIL in .env

    # Gmail SMTP (Python built-in — no extra package needed)
    # Setup: Gmail → Security → 2FA on → App Passwords → generate 16-char password
    gmail_user: str = ""
    gmail_pass: str = ""

    # Admin — set your email here to access /admin/stats
    admin_email: str = ""
    web3forms_key: str = ""
    frontend_url: str = "https://kw-trading-copilot.vercel.app"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def has_ai(self) -> bool:
        """True if any AI provider is configured."""
        return bool(self.anthropic_api_key or self.openrouter_api_key)

    class Config:
        env_file = ".env"


settings = Settings()

# Warn loudly if default insecure secret is still in use
if settings.secret_key == _INSECURE_SECRET:
    warnings.warn(
        "\n\n⚠️  SECURITY WARNING: SECRET_KEY is using the default insecure value!\n"
        "   Set a strong random SECRET_KEY in your .env file before deploying.\n"
        "   Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\"\n",
        stacklevel=1,
    )
    logger.critical("SECRET_KEY is not set — JWT tokens are INSECURE. Set SECRET_KEY in .env immediately.")
