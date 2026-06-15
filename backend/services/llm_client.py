"""
Unified LLM client with an automatic provider cascade.

Order: Gemini Flash (primary)  ->  Groq llama-3.3-70b  ->  Groq llama-3.1-8b.

Any provider that errors, rate-limits (429), or returns invalid JSON is skipped
and the next one is tried. A provider with no API key configured is skipped too,
so you can widen/narrow the pool just by adding/removing keys in backend/.env.
"""
import os
import json
import httpx
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Primary Gemini model (free tier, smart, great at structured JSON + LaTeX).
# NOTE: 2.0-flash is quota-blocked on this project; 2.5-flash works on free tier.
GEMINI_MODEL = "gemini-2.5-flash"
# Groq fallbacks, best first.
GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

_groq = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def _gemini(system: str, user: str, json_mode: bool, temperature: float, max_tokens: int) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    cfg = {"temperature": temperature, "maxOutputTokens": max_tokens}
    if json_mode:
        cfg["responseMimeType"] = "application/json"
    # 2.5/3.x are "thinking" models — disable thinking for fast, predictable
    # structured output (so thinking tokens don't eat the JSON output budget).
    if "2.5" in GEMINI_MODEL or "gemini-3" in GEMINI_MODEL:
        cfg["thinkingConfig"] = {"thinkingBudget": 0}
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": user}]}],
        "generationConfig": cfg,
    }
    r = httpx.post(
        GEMINI_URL.format(model=GEMINI_MODEL),
        headers={"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"},
        json=body,
        timeout=120,
    )
    r.raise_for_status()
    data = r.json()
    cands = data.get("candidates")
    if not cands:
        raise RuntimeError(f"Gemini: no candidates ({data.get('promptFeedback')})")
    parts = cands[0].get("content", {}).get("parts", [])
    text = "".join(p.get("text", "") for p in parts).strip()
    if not text:
        raise RuntimeError(f"Gemini: empty text (finishReason={cands[0].get('finishReason')})")
    return text


def _groq_complete(system: str, user: str, json_mode: bool, temperature: float, max_tokens: int, model: str) -> str:
    if not _groq:
        raise RuntimeError("GROQ_API_KEY not set")
    kwargs = dict(
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    resp = _groq.chat.completions.create(**kwargs)
    return resp.choices[0].message.content


def complete(system: str, user: str, json_mode: bool = True,
             temperature: float = 0.3, max_tokens: int = 4096) -> str:
    """
    Run the prompt through the provider cascade and return the response text
    (a valid JSON string when json_mode=True). Raises only if every provider fails.
    """
    providers = []
    if GEMINI_API_KEY:
        providers.append(("gemini", GEMINI_MODEL))
    if _groq:
        providers.extend(("groq", m) for m in GROQ_MODELS)

    last_err = None
    for kind, model in providers:
        try:
            if kind == "gemini":
                out = _gemini(system, user, json_mode, temperature, max_tokens)
            else:
                out = _groq_complete(system, user, json_mode, temperature, max_tokens, model)

            if not out or not out.strip():
                raise RuntimeError("empty response")
            if json_mode:
                json.loads(out)  # validate; invalid JSON -> fall through to next provider

            print(f"[llm] {kind}:{model} OK")
            return out
        except Exception as e:
            last_err = e
            print(f"[llm] {kind}:{model} failed ({type(e).__name__}: {str(e)[:120]}) -> falling back")
            continue

    raise RuntimeError(f"All LLM providers failed. Last error: {last_err}")
