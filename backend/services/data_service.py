"""
Data service — honest version (fixes bug #6).

Before: the dashboard returned hard-typed numbers presented as live data.gov.in
data, and search returned a hand-typed scheme list that didn't match the actual
PDFs. Now:
  * search_schemes() is driven by the REAL scheme names derived from the PDFs
    in data/chroma/policies/ (single source of truth: ingest_pdfs).
  * get_dashboard_stats() is explicitly flagged is_illustrative=True and counts
    the real number of indexed schemes; it no longer pretends to be live.
  * fetch_datagov_scheme_data() only returns data if a real DATAGOV_API_KEY +
    dataset id are configured, else None (the placeholder ids returned nothing).
"""
import logging
from datetime import datetime
from typing import Optional, List, Dict

import requests
from sentence_transformers import SentenceTransformer

import config
from scripts.ingest_pdfs import list_known_schemes

logger = logging.getLogger("janniti.data")

DATAGOV_BASE = "https://api.data.gov.in/resource"
# Real dataset ids only — left empty by design. Add a verified id + key to enable.
SCHEME_DATASETS: Dict[str, str] = {}


def _ministry_guess(name: str) -> str:
    n = name.lower()
    if any(w in n for w in ("kisan", "fasal", "bima yojna", "samman nidhi")):
        return "Ministry of Agriculture & Farmers Welfare"
    if any(w in n for w in ("scholarship", "talent", "research fellowship", "single girl")):
        return "Ministry of Education"
    if any(w in n for w in ("kaushal", "skill", "rozgar")):
        return "Ministry of Skill Development & Entrepreneurship"
    if any(w in n for w in ("mudra", "jan dhan", "jeevan jyoti", "suraksha", "stand up", "loan")):
        return "Ministry of Finance"
    if "garib kalyan" in n:
        return "Ministry of Consumer Affairs, Food & Public Distribution"
    if "pension" in n:
        return "Ministry of Finance (PFRDA)"
    return "Government of India"


async def fetch_datagov_scheme_data(scheme_id: str) -> Optional[Dict]:
    if not config.DATAGOV_API_KEY:
        return None
    dataset_id = SCHEME_DATASETS.get(scheme_id)
    if not dataset_id:
        return None
    try:
        resp = requests.get(f"{DATAGOV_BASE}/{dataset_id}",
                            params={"api-key": config.DATAGOV_API_KEY, "format": "json", "limit": 100},
                            timeout=10)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        logger.warning(f"data.gov.in fetch failed: {e}")
    return None


_scheme_search_embedder = None
_scheme_search_cache: Optional[List[dict]] = None
_scheme_search_embeds: Optional[List[list]] = None


def _get_scheme_search_index():
    global _scheme_search_embedder, _scheme_search_cache, _scheme_search_embeds
    if _scheme_search_cache is not None and _scheme_search_embeds is not None:
        return _scheme_search_cache, _scheme_search_embeds

    scheme_names = list_known_schemes()
    schemes = []
    for name in scheme_names:
        slug = name.lower().replace(" ", "-")
        schemes.append({"id": slug, "name": name, "ministry": _ministry_guess(name),
                        "type": "Central", "source": "Ingested official PDF"})

    try:
        if _scheme_search_embedder is None:
            _scheme_search_embedder = SentenceTransformer(config.EMBED_MODEL)
        _scheme_search_embeds = _scheme_search_embedder.encode(scheme_names).tolist()
    except Exception:
        _scheme_search_embeds = []

    _scheme_search_cache = schemes
    return schemes, _scheme_search_embeds


def _cosine_similarity(a: list, b: list) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(y * y for y in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

async def search_schemes(query: str, language: str = "en") -> List[Dict]:
    """Search the REAL ingested schemes (from the PDF filenames).

    The current knowledge base uses English scheme names, so searches are
    performed over those names even when the UI language is different. This
    function uses multilingual embeddings to match queries across supported
    Indian languages as best as possible.
    """
    schemes, scheme_embeds = _get_scheme_search_index()
    q = query.strip()
    if not q:
        return schemes[:10]

    q_lower = q.lower()
    hits = [s for s in schemes if q_lower in s["name"].lower()]
    if hits:
        return hits[:10]

    words = q_lower.split()
    hits = [s for s in schemes if any(w in s["name"].lower() for w in words)]
    if hits:
        return hits[:10]

    if scheme_embeds:
        try:
            embedder = SentenceTransformer(config.EMBED_MODEL)
            query_embed = embedder.encode(q).tolist()
            scored = []
            for scheme, scheme_embed in zip(schemes, scheme_embeds):
                score = _cosine_similarity(query_embed, scheme_embed)
                if score > 0:
                    scored.append((score, scheme))
            scored.sort(key=lambda item: item[0], reverse=True)
            return [scheme for _, scheme in scored[:10]]
        except Exception:
            pass

    return schemes[:10]


async def get_dashboard_stats() -> Dict:
    """Illustrative dashboard — clearly flagged, with the real indexed count."""
    real_schemes = list_known_schemes()
    return {
        "total_beneficiaries": "Illustrative — not live data",
        "total_funds_disbursed": "Illustrative — not live data",
        "state_coverage": [],   # empty rather than fabricated; frontend hides the table
        "last_updated": datetime.now().strftime("%B %d, %Y"),
        "source": (f"JanNiti knowledge base: {len(real_schemes)} official scheme documents indexed. "
                   "Headline figures are illustrative placeholders, not live government statistics. "
                   "For live data see data.gov.in / myscheme.gov.in."),
        "top_schemes": [{"name": n, "beneficiaries": "See official portal", "funds": "See official portal"}
                        for n in real_schemes[:6]],
        "is_illustrative": True,
    }
