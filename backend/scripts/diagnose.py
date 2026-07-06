"""
Quick diagnosis: is the AI (LLM) actually working, and does translation succeed?

Run from the backend folder:
    py -3.11 -m scripts.diagnose

It prints a clear PASS/FAIL so we know whether the translation problem is:
  * the AI key / credits / connection (LLM call fails), or
  * something in the translation code.
"""
import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("=" * 60)
print("JanNiti translation diagnosis")
print("=" * 60)

# 1) config
try:
    import config
    print(f"LLM_PROVIDER      = {config.LLM_PROVIDER}")
    print(f"ANTHROPIC_MODEL   = {getattr(config, 'ANTHROPIC_MODEL', '?')}")
    print(f"OPENAI_MODEL      = {getattr(config, 'OPENAI_MODEL', '?')}")
    print(f"LLM_MAX_TOKENS    = {getattr(config, 'LLM_MAX_TOKENS', '?')}")
    ak = os.getenv("ANTHROPIC_API_KEY", "")
    ok = os.getenv("OPENAI_API_KEY", "")
    print(f"ANTHROPIC_API_KEY = {'set (' + str(len(ak)) + ' chars)' if ak else 'NOT SET'}")
    print(f"OPENAI_API_KEY    = {'set (' + str(len(ok)) + ' chars)' if ok else 'NOT SET'}")
except Exception:
    print("Could not read config:")
    traceback.print_exc()

print("-" * 60)

# 2) raw LLM test — call the client directly so the REAL error is visible
try:
    from services.llm import _get_client
    client, kind = _get_client()
    if client is None:
        print("RESULT: FAIL — no AI client could be created.")
        print("        Your API key is missing or the provider is misconfigured.")
        print("        Set a working key in the backend .env, then restart.")
    else:
        print("Calling the AI with a tiny test prompt (direct, real errors shown)...")
        msg = "Translate to Hindi, reply with only the translation: Hello, how are you?"
        try:
            if kind == "anthropic":
                resp = client.messages.create(
                    model=config.ANTHROPIC_MODEL, max_tokens=100,
                    messages=[{"role": "user", "content": msg}],
                )
                reply = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text").strip()
            else:
                resp = client.chat.completions.create(
                    model=config.OPENAI_MODEL, max_tokens=100,
                    messages=[{"role": "user", "content": msg}],
                )
                reply = (resp.choices[0].message.content or "").strip()
        except Exception as call_err:
            print("\nRESULT: FAIL — the AI call raised this error (THIS is the cause):\n")
            print("   ", type(call_err).__name__, "-", str(call_err)[:400])
            print("\n   Common fixes:")
            print("   • 'authentication'/401 -> API key wrong or expired")
            print("   • 'credit'/'quota'/429 -> out of credits or rate-limited")
            print("   • 'model'/'not_found'/404 -> model name in .env is wrong")
            print("   Fix that in the backend .env, then restart the backend.")
            print("=" * 60)
            sys.exit(0)

        if not reply:
            print("RESULT: FAIL — the AI returned an empty reply.")
        else:
            print(f"RESULT: PASS — the AI replied: {reply[:120]!r}")
            print("        So the AI works. Testing a full scheme translation next...")
            print("-" * 60)
            from services import kb_service
            from services.ai_service import _translate_explainer_dict
            s = kb_service.match("pm kisan")
            base = kb_service.explainer_dict(s)
            translated, good = _translate_explainer_dict(base, "hi")
            print(f"Scheme translation ok={good}")
            print(f"  what_is (Hindi?): {translated['what_is'][:100]!r}")
            print(f"  benefit[0]      : {translated['benefits'][0][:100]!r}")
            if good and translated["what_is"] != base["what_is"]:
                print("RESULT: PASS — translation works. If the app still shows English,")
                print("        delete backend/data/translations and hard-refresh (Ctrl+Shift+R).")
            else:
                print("RESULT: PARTIAL — the AI replied but translation didn't fully apply.")
                print("        Send this whole output to Claude.")
except Exception:
    print("ERROR during LLM test:")
    traceback.print_exc()

print("=" * 60)
