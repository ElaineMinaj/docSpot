"""Small wrapper around the AI provider. Uses OpenAI if OPENAI_API_KEY is set in
backend/.env, otherwise Anthropic (Claude) if ANTHROPIC_API_KEY is set.
Every call returns None on any failure (no key, timeout, refusal, bad output)
so callers can fall back."""
import json
import logging
import os

log = logging.getLogger("ai")
_clients = {}


def provider():
    if os.getenv("OPENAI_API_KEY"):
        return "openai"
    if os.getenv("ANTHROPIC_API_KEY"):
        return "anthropic"
    return None


def available():
    return provider() is not None


def model():
    p = provider()
    if p == "openai":
        return os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    if p == "anthropic":
        return os.getenv("CLAUDE_MODEL", "claude-opus-5")
    return None


# ---------- OpenAI ----------

def _openai(system, user, timeout, schema):
    import openai
    if "openai" not in _clients:
        _clients["openai"] = openai.OpenAI(max_retries=0)  # the frontend has its own short timeout
    kwargs = {}
    if schema:
        kwargs["response_format"] = {"type": "json_schema", "json_schema": {"name": "result", "schema": schema, "strict": True}}
    try:
        resp = _clients["openai"].with_options(timeout=timeout).chat.completions.create(
            model=model(),
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            temperature=0,  # stick closely to the given facts
            **kwargs,
        )
    except openai.APITimeoutError:
        log.warning("OpenAI call timed out after %ss", timeout)
        return None
    except openai.APIStatusError as e:
        log.warning("OpenAI API error %s: %s", e.status_code, e.message)
        return None
    except openai.APIConnectionError:
        log.warning("Could not reach the OpenAI API")
        return None
    choice = resp.choices[0]
    if choice.finish_reason != "stop" or getattr(choice.message, "refusal", None):
        log.warning("OpenAI stopped with %s", choice.finish_reason)
        return None
    return (choice.message.content or "").strip() or None


# ---------- Anthropic ----------

# Server-side refusal fallbacks are only offered on these models
_FALLBACK_MODELS = {"claude-opus-5", "claude-fable-5-1"}


def _anthropic(system, user, timeout, schema):
    import anthropic
    if "anthropic" not in _clients:
        _clients["anthropic"] = anthropic.Anthropic(max_retries=0)
    extra = {}
    if model() in _FALLBACK_MODELS:
        extra = {"betas": ["server-side-fallback-2026-07-01"], "fallbacks": "default"}
    output_config = {"effort": "low"}
    if schema:
        output_config["format"] = {"type": "json_schema", "schema": schema}
    try:
        resp = _clients["anthropic"].with_options(timeout=timeout).beta.messages.create(
            model=model(),
            max_tokens=2048,
            system=system,
            messages=[{"role": "user", "content": user}],
            output_config=output_config,
            **extra,
        )
    except anthropic.APITimeoutError:
        log.warning("Claude call timed out after %ss", timeout)
        return None
    except anthropic.APIStatusError as e:
        log.warning("Claude API error %s: %s", e.status_code, e.message)
        return None
    except anthropic.APIConnectionError:
        log.warning("Could not reach the Claude API")
        return None
    if resp.stop_reason in ("refusal", "max_tokens"):
        log.warning("Claude stopped with %s", resp.stop_reason)
        return None
    return "".join(b.text for b in resp.content if b.type == "text").strip() or None


# ---------- Shared ----------

def _call(system, user, timeout, schema=None):
    p = provider()
    if p == "openai":
        return _openai(system, user, timeout, schema)
    if p == "anthropic":
        return _anthropic(system, user, timeout, schema)
    return None


def ask_text(system, user, timeout):
    return _call(system, user, timeout)


def ask_json(system, user, schema, timeout):
    out = _call(system, user, timeout, schema)
    if out is None:
        return None
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        log.warning("AI returned invalid JSON")
        return None
