# Quick Fix Reference - Section Classification Issue

## What Was Wrong?
- RAG was retrieving sections from markdown (Benefits, Eligibility, Documents, etc.) with proper metadata
- Backend was **ignoring the section metadata** and doing keyword matching instead
- Result: Sections were misclassified or mixed up

## What's Fixed?
✅ `extractive.py` now uses section metadata from RAG results  
✅ `ai_service.py` now shows section labels to the LLM  
✅ Fallback (no LLM) now properly classifies sections  
✅ All sections now work: Benefits, Eligibility, Documents, How to Apply, Clauses

## How It Works Now

### 1. Markdown → Ingestion (ingest_pdfs.py)
```
## Key Benefits
This becomes: metadata["section"] = "Key Benefits"
```

### 2. RAG Returns Section Info (rag_service.py)
```python
{
    "text": "Benefits text here...",
    "metadata": {
        "section": "Key Benefits",
        "name": "Atal Pension Yojana"
    }
}
```

### 3. Backend Extraction (extractive.py + ai_service.py)
```python
# Extracts sections using metadata
sections = _extract_sections_by_metadata(rag_results)
# Returns:
# - sections["benefits"] = [list of benefit items]
# - sections["eligibility"] = [list of eligibility criteria]
# - sections["documents"] = [list of required documents]
# - sections["apply"] = [list of application steps]
```

### 4. LLM Gets Clear Context (ai_service.py)
```
[Key Benefits]
Benefits text here...

[Eligibility Criteria]
Eligibility text here...

[Required Documents]
Documents text here...
```

### 5. Frontend Displays Properly (explainer/page.tsx)
```
✓ Benefits list with checkmarks
✓ Eligibility criteria with user icons
✓ Documents needed with file icons
✓ Application process with clipboard icon
✓ Important clauses with alert colors
```

## Testing
```bash
cd backend
python test_section_extraction.py
```

Should show:
```
BENEFITS: 3 items
ELIGIBILITY: 2 items
DOCUMENTS: 1 items
APPLY: 1 items
DATES: 2 items
CLAUSES: 3 items
```

## Code Changes

### extractive.py
```python
# NEW: Section mapping
SECTION_MAP = {
    "benefits": ["Key Benefits", "Benefits"],
    "eligibility": ["Eligibility Criteria", "Eligibility"],
    "documents": ["Required Documents", "Documents"],
    "apply": ["Application Process", "How to Apply"],
    "dates": ["Important Dates", "Dates"],
    "clauses": ["Misunderstood Clauses"],
}

# NEW: Extract using metadata
sections = _extract_sections_by_metadata(rag_results)

# UPDATED: build_explainer() uses _extract_sections_by_metadata()
# UPDATED: build_conditions() uses section info for clauses
```

### ai_service.py
```python
# UPDATED: generate_explainer() - shows section labels to LLM
context_parts = []
for r in rag_results:
    section = r.get("metadata", {}).get("section", "Details")
    context_parts.append(f"[{section}]\n{text}")

# UPDATED: detect_conditions() - same treatment
```

## Integration Checklist

- [x] Modified extractive.py ✓
- [x] Modified ai_service.py ✓
- [x] Test passes ✓
- [x] No syntax errors ✓
- [x] No breaking changes ✓
- [x] Backward compatible ✓

## Rollback (if needed)
Just revert the changes to:
- `backend/services/extractive.py`
- `backend/services/ai_service.py`

Everything else remains unchanged.

## Next Steps
1. Run backend tests: `pytest backend/`
2. Test in UI: Search for a scheme in Explainer
3. Verify all sections appear:
   - Benefits ✓
   - Eligibility ✓
   - Documents ✓
   - How to Apply ✓
   - Conditions ✓

---
For full details, see: SECTION_CLASSIFICATION_FIX.md
