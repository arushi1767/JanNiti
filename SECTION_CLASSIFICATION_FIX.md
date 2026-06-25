# Section Classification Fixes - Implementation Guide

## Problem Summary
The RAG system was retrieving data from structured markdown files with proper section metadata (Benefits, Eligibility, Documents, Application Process, etc.), but the backend services were **ignoring this metadata** and using only keyword matching, resulting in:
- Misclassified sections
- Poor extraction of eligibility criteria
- Documents not properly distinguished from other content
- How-to-apply information mixed with other sections

## Solution Architecture

### 1. **Enhanced extractive.py** - Section-Aware Extraction
**File**: `backend/services/extractive.py`

#### Key Changes:
```python
# New mapping of markdown section names to response fields
SECTION_MAP = {
    "benefits": ["Key Benefits", "Benefits", "What are the benefits"],
    "eligibility": ["Eligibility Criteria", "Eligibility", "Who is eligible"],
    "documents": ["Required Documents", "Documents Required", "Documents"],
    "apply": ["Application Process", "How to Apply", "Application"],
    "dates": ["Important Dates", "Dates", "Deadlines"],
    "clauses": ["Misunderstood Clauses", "Important Clauses", "Terms and Conditions"],
}
```

#### New Function: `_extract_sections_by_metadata()`
- Reads the `section` metadata field from each RAG result
- Groups content by section name using fuzzy matching
- Returns a dictionary with properly classified content
- Falls back to keyword matching only if metadata is sparse

#### Updated Function: `build_explainer()`
- Now calls `_extract_sections_by_metadata()` first
- Uses structured section information when available
- Falls back to keyword matching only as last resort
- Better handles multi-part sections (splits by `## headings`)

#### Updated Function: `build_conditions()`
- Now extracts clauses from the "Misunderstood Clauses" section
- Applies severity classification (red/yellow/green)
- Falls back to keyword matching if section data unavailable

### 2. **Improved ai_service.py** - Better LLM Prompting
**File**: `backend/services/ai_service.py`

#### Key Changes:
```python
# Build context with section labels visible to LLM
context_parts = []
for r in rag_results:
    text = r["text"]
    section = (r.get("metadata") or {}).get("section", "Details")
    context_parts.append(f"[{section}]\n{text}")
context = "\n\n".join(context_parts)
```

#### Updated Prompts:
- `generate_explainer()`: Now shows section labels like `[Key Benefits]`, `[Eligibility Criteria]`
- Explicitly instructs LLM to extract into these sections
- Includes array size hints (3-5 items for benefits, 4-6 items for documents)
- `detect_conditions()`: Clearer severity definitions for color coding

#### Benefits:
- LLM has explicit section boundaries
- Better structured JSON output
- Reduced hallucination of sections that don't exist
- Clearer separation when LLM is unavailable

### 3. **Ingestion Pipeline** - Already Correct
**File**: `backend/scripts/ingest_pdfs.py`

No changes needed - the markdown ingestion already:
✅ Splits documents by `## section` headings  
✅ Attaches `"section": title` metadata to each chunk  
✅ Preserves section names like "Key Benefits", "Eligibility Criteria"  

### 4. **Data Flow Diagram**

```
Markdown Files (knowledge_base_md/)
    ↓
    ├─→ build_md_kb.py (creates structured sections)
    │   └─→ ## Key Benefits
    │   └─→ ## Eligibility Criteria
    │   └─→ ## Required Documents
    │   └─→ ## Application Process
    │
    ↓
ingest_pdfs.py (ingest_markdown_kb)
    ├─→ Splits on ## headings
    ├─→ Adds metadata: section="Key Benefits"
    ├─→ Stores in Chroma with section info
    │
    ↓
RAG Search (rag_service.py)
    ├─→ Returns chunks with section metadata
    │   {
    │     "text": "Monthly pension of Rs. 1000...",
    │     "metadata": {
    │       "section": "Key Benefits",
    │       "name": "Atal Pension Yojana",
    │       "source": "atal_pension_yojna.md"
    │     }
    │   }
    │
    ↓
Extraction Services
    ├─→ ai_service.py (with LLM)
    │   └─→ Sends context with section labels [Key Benefits], [Eligibility]
    │   └─→ LLM extracts properly structured fields
    │
    └─→ extractive.py (fallback, no LLM)
        └─→ Uses _extract_sections_by_metadata()
        └─→ Groups content by section
        └─→ Returns properly classified response
    │
    ↓
Frontend (explainer/page.tsx)
    ├─→ Renders benefits list (with green checkmarks)
    ├─→ Renders eligibility criteria (with user icons)
    ├─→ Renders documents needed (with file icons)
    ├─→ Renders application process (with clipboard icon)
    └─→ Renders conditions/clauses (with alert colors)
```

## Testing the Changes

### Test File: `backend/test_section_extraction.py`
Run to verify section extraction works:
```bash
cd backend
python test_section_extraction.py
```

Expected output shows:
- ✅ BENEFITS section properly extracted
- ✅ ELIGIBILITY section properly extracted
- ✅ DOCUMENTS section properly extracted
- ✅ APPLY section properly extracted
- ✅ CLAUSES section properly extracted with severity levels

### Real-World Testing:
1. Search for any scheme in the explainer section
2. Check that Benefits list appears correctly
3. Check Eligibility shows proper criteria
4. Check Required Documents shows document types
5. Check "How to Apply" shows application steps
6. Check Hidden Conditions shows important clauses

## Compatibility Notes

### ✅ Backward Compatibility
- Fallback to keyword matching still works for non-structured documents
- Old text-based knowledge base (knowledge_base/*.txt) still supported
- Mixed ingestion (markdown + text) handled correctly

### ✅ Language Support
- All language translations preserved
- Section names matched case-insensitively
- Fallback messages translated appropriately

### ✅ Graceful Degradation
- If LLM unavailable: extractive.py provides proper sections
- If section metadata missing: keyword matching kicks in
- If query not found: returns empty lists, not errors

## Known Limitations & Future Improvements

### Current Behavior
1. Section matching is fuzzy (case-insensitive, partial matches)
2. Keyword matching is still used as fallback
3. Order within sections depends on RAG result order

### Future Enhancements
1. **Semantic section matching**: Use embeddings to match sections more precisely
2. **Multi-language sections**: Map section names across different language markdown files
3. **Custom section templates**: Let schemes define their own section structure
4. **Section-aware ranking**: Boost results from the "right" section for the query

## File Changes Summary

| File | Changes | Impact |
|------|---------|--------|
| `services/extractive.py` | Added `SECTION_MAP`, `_is_section_match()`, `_extract_sections_by_metadata()`, updated `build_explainer()` and `build_conditions()` | Better section classification without LLM |
| `services/ai_service.py` | Updated `generate_explainer()` and `detect_conditions()` with section-labeled context | Better LLM prompting and structured output |
| `scripts/ingest_pdfs.py` | No changes | Already working correctly |
| `test_section_extraction.py` | New test file | Validation and documentation |

## Verification Checklist

- [x] Syntax check: No Python errors in modified files
- [x] Import check: Modules import successfully
- [x] Unit test: test_section_extraction.py passes
- [x] Section metadata: Verified in RAG results
- [x] Fallback logic: Keyword matching still works
- [x] Frontend compatibility: Response schema unchanged

## Support

For issues related to section extraction:
1. Check that markdown files have proper section headings (## Name)
2. Verify RAG ingestion logs show section metadata
3. Run test_section_extraction.py to debug
4. Check ai_service.py logs for LLM prompt issues
