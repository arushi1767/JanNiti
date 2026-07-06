"""
Pre-translate every scheme into every supported language, once.

After you run this, EVERY explainer in EVERY language is served instantly from
the on-disk cache (backend/data/translations/) — the same speed as English —
with no per-request LLM call.

Run it once, from the backend folder, with your LLM key configured (the same
setup your server uses):

    cd backend
    py -3.11 -m scripts.pretranslate

It is safe to re-run: schemes/languages already cached are skipped. To force a
rebuild, delete backend/data/translations/ first (or pass --force).

Notes:
- This makes many LLM calls (18 schemes x 14 languages). It can take a while
  and uses your API credits. You only need to do it once.
- English is never translated (it's built straight from the knowledge base).
"""
import argparse
import logging
import os
import sys
import time

# allow "py -m scripts.pretranslate" from the backend folder
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

logging.basicConfig(level=logging.WARNING)

from services import kb_service, translation_cache          # noqa: E402
from services.ai_service import _translate_explainer_dict    # noqa: E402

# 14 non-English languages (English is served from the KB directly)
LANGS = ["hi", "or", "as", "bn", "gu", "kn", "ml", "mr", "pa", "ta", "te", "ur", "ks", "mai"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-translate even if cached")
    ap.add_argument("--langs", nargs="*", default=LANGS, help="subset of language codes")
    args = ap.parse_args()

    schemes = kb_service.all_schemes()
    total = len(schemes) * len(args.langs)
    done = ok_count = skip = fail = 0
    t0 = time.time()

    print(f"Pre-translating {len(schemes)} schemes x {len(args.langs)} languages "
          f"= {total} combinations...\n")

    for s in schemes:
        base = kb_service.explainer_dict(s)
        for lang in args.langs:
            done += 1
            if not args.force and translation_cache.get(s.slug, lang):
                skip += 1
                print(f"[{done}/{total}] skip  {s.slug} / {lang} (already cached)")
                continue
            translated, good = _translate_explainer_dict(base, lang)
            if good:
                translation_cache.put(s.slug, lang, translated)
                ok_count += 1
                print(f"[{done}/{total}] OK    {s.slug} / {lang}")
            else:
                fail += 1
                print(f"[{done}/{total}] FAIL  {s.slug} / {lang} (LLM issue — not cached, will retry live)")

    dt = time.time() - t0
    print(f"\nDone in {dt:.0f}s. translated={ok_count}  skipped={skip}  failed={fail}")
    if fail:
        print("Some failed (usually API rate limit / credit). Just run this again to fill them in.")


if __name__ == "__main__":
    main()
