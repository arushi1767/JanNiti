########################################################################
  TRANSLATION FIX — make ALL languages show translated CONTENT (not just headers)
########################################################################

THE BUG YOU SAW
Headers changed language but the paragraph content stayed English. Cause: the
old translator sent the whole answer as one big JSON to the AI, and for long
content in Indic scripts that response got cut off / malformed, so it silently
fell back to English.

THE FIX (already in this pack — backend/services/ai_service.py)
The translator now sends the text as a simple numbered list, in small safe
batches, so it can't be truncated. It also only caches a translation when it
fully succeeds, so you never get stuck with a half-English answer.

HOW TO APPLY
1. Copy the backend folder from this pack over your project (Replace).
2. IMPORTANT — clear any bad cached translations from before the fix:
   delete this folder if it exists:
      C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\backend\data\translations
   (It will be rebuilt automatically. Skip if it doesn't exist.)
3. Restart the backend.
4. Open the Explainer, pick a scheme, switch to Hindi (or any language).
   - First time in that language: takes a few seconds (it's translating), then
     the WHOLE answer — headers AND content — is in that language.
   - Open it again: instant (served from cache).

MAKE EVERY LANGUAGE INSTANT (optional, recommended)
So no user ever waits, pre-translate everything once. With your AI key set up
(same as your server), run from the backend folder:

    cd "C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\backend"
    py -3.11 -m scripts.pretranslate

This fills the cache for all 18 schemes x 14 languages. After it finishes,
every explainer in every language loads at the SAME SPEED as English.
- Safe to re-run; already-done ones are skipped.
- It makes many AI calls, so it takes a while and uses API credits — but only
  once.

WHY FIRST-VIEW ISN'T INSTANT WITHOUT PRE-TRANSLATION
English is built straight from the knowledge base (no AI), so it's instant.
Other languages must be translated by the AI the first time. Caching makes
every later view instant; pre-translating makes the FIRST view instant too.
########################################################################
