from pydantic import BaseModel, Field


class ChatQueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    symbol: str | None = Field(default=None, description="Optional asset symbol for context")


class ChatQueryResponse(BaseModel):
    query: str
    response: str
    symbols_used: list[str] = Field(default_factory=list)
    source: str = "ai"
