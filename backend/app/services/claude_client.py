"""
AI client — supports two providers with automatic fallback:
  1. Anthropic (claude-sonnet-4-5) — if ANTHROPIC_API_KEY is set
  2. OpenRouter (free models)       — if OPENROUTER_API_KEY is set
  3. Rule-based fallback            — always works, no API key needed
"""
import json
import re

import httpx

from app.core.config import settings
from app.schemas.signal import RiskLevel, SignalAction, TechnicalIndicators


# ── Provider: OpenRouter (free tier) ─────────────────────────────────────────

async def _ask_openrouter(prompt: str, max_tokens: int = 1024) -> str:
    """
    OpenRouter uses OpenAI-compatible API.
    Free models: meta-llama/llama-3.3-8b-instruct:free
                 mistralai/mistral-7b-instruct:free
                 google/gemma-3-27b-it:free
    Get free key at: https://openrouter.ai/keys
    """
    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://trading-copilot.app",
                "X-Title": "AI Trading Copilot",
            },
            json={
                "model": settings.openrouter_model,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
        )
        response.raise_for_status()
        data = response.json()

    return data["choices"][0]["message"]["content"]


# ── Provider: Anthropic (direct) ─────────────────────────────────────────────

async def _ask_anthropic(prompt: str, max_tokens: int = 1024) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.anthropic_api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-5",
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
        )
        response.raise_for_status()
        data = response.json()

    return data["content"][0]["text"]


# ── Public interface ──────────────────────────────────────────────────────────

async def ask_claude(prompt: str, max_tokens: int = 1024) -> str:
    """
    Ask AI — tries Anthropic first, then OpenRouter, raises if neither works.
    """
    if settings.anthropic_api_key:
        try:
            return await _ask_anthropic(prompt, max_tokens)
        except Exception:
            pass  # Fall through to OpenRouter

    if settings.openrouter_api_key:
        return await _ask_openrouter(prompt, max_tokens)

    raise RuntimeError("No AI provider configured (set ANTHROPIC_API_KEY or OPENROUTER_API_KEY)")


# ── Signal generation ─────────────────────────────────────────────────────────

async def generate_ai_signal(
    symbol: str,
    price: float,
    indicators: TechnicalIndicators,
    sentiment_summary: str,
    price_action_summary: str,
) -> dict:
    if settings.has_ai:
        try:
            return await _call_ai_signal(
                symbol, price, indicators, sentiment_summary, price_action_summary
            )
        except Exception:
            pass

    return _rule_based_signal(symbol, price, indicators, price_action_summary)


async def _call_ai_signal(
    symbol: str,
    price: float,
    indicators: TechnicalIndicators,
    sentiment_summary: str,
    price_action_summary: str,
) -> dict:
    prompt = f"""You are a trading analyst. Analyze the following data and produce a structured trading signal.

Asset: {symbol}
Current Price: {price}
Technical Indicators: RSI={indicators.rsi}, MACD={indicators.macd}, MACD Signal={indicators.macd_signal}, MA50={indicators.ma50}, MA200={indicators.ma200}
Recent News Sentiment: {sentiment_summary}
Recent Price Action (last 20 candles): {price_action_summary}

Respond ONLY in JSON (no markdown, no explanation outside JSON):
{{
  "signal": "BUY",
  "confidence": 75,
  "reasoning": "2-3 sentence explanation in simple language",
  "risk_level": "medium"
}}"""

    text = await ask_claude(prompt, max_tokens=512)
    return _parse_signal_json(text)


def _parse_signal_json(text: str) -> dict:
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object in AI response")

    parsed = json.loads(match.group())
    signal = parsed["signal"].upper()
    if signal not in {"BUY", "SELL", "HOLD"}:
        raise ValueError(f"Invalid signal: {signal}")

    return {
        "signal": SignalAction(signal),
        "confidence": float(parsed["confidence"]),
        "reasoning": str(parsed["reasoning"]),
        "risk_level": RiskLevel(str(parsed["risk_level"]).lower()),
        "source": "claude" if settings.anthropic_api_key else "openrouter",
    }


# ── Rule-based fallback (no API key needed) ───────────────────────────────────

def _rule_based_signal(
    symbol: str,
    price: float,
    indicators: TechnicalIndicators,
    price_action_summary: str,
) -> dict:
    score = 0
    reasons: list[str] = []

    if indicators.rsi is not None:
        if indicators.rsi < 35:
            score += 2
            reasons.append(f"RSI at {indicators.rsi:.1f} suggests oversold conditions")
        elif indicators.rsi > 65:
            score -= 2
            reasons.append(f"RSI at {indicators.rsi:.1f} suggests overbought conditions")
        else:
            reasons.append(f"RSI at {indicators.rsi:.1f} is neutral")

    if indicators.macd is not None and indicators.macd_signal is not None:
        if indicators.macd > indicators.macd_signal:
            score += 1
            reasons.append("MACD is above its signal line (bullish momentum)")
        else:
            score -= 1
            reasons.append("MACD is below its signal line (bearish momentum)")

    if indicators.ma50 is not None and indicators.ma200 is not None:
        if price > indicators.ma50 > indicators.ma200:
            score += 1
            reasons.append("Price is above rising moving averages")
        elif price < indicators.ma50 < indicators.ma200:
            score -= 1
            reasons.append("Price is below declining moving averages")

    if score >= 2:
        signal = SignalAction.buy
        confidence = min(85.0, 55 + score * 10)
        risk_level = RiskLevel.medium
    elif score <= -2:
        signal = SignalAction.sell
        confidence = min(85.0, 55 + abs(score) * 10)
        risk_level = RiskLevel.medium
    else:
        signal = SignalAction.hold
        confidence = 50.0
        risk_level = RiskLevel.low

    reasoning = ". ".join(reasons[:3]) + f" {price_action_summary}"

    return {
        "signal": signal,
        "confidence": confidence,
        "reasoning": reasoning.strip(),
        "risk_level": risk_level,
        "source": "rules",
    }
