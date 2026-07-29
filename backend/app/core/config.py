from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Trading Copilot API"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/trading_copilot"
    secret_key: str = "change-me-in-production-use-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:3000"
    # Anthropic direct (optional)
    anthropic_api_key: str = ""
    # OpenRouter (free tier available — https://openrouter.ai)
    openrouter_api_key: str = ""
    openrouter_model: str = "meta-llama/llama-3.3-8b-instruct:free"
    # Market data APIs
    alpha_vantage_api_key: str = ""
    twelve_data_api_key: str = ""
    news_api_key: str = ""

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
