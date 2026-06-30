# JanNiti Knowledge Base — CHANGELOG

**Generated:** 2026-06-27  
**Scope:** Full regeneration of the Markdown knowledge base in `backend/data/knowledge_base_md/` — 18 government-scheme files, rebuilt from authoritative government sources and merged with the source PDFs.  
**Pipeline target:** `scripts/ingest_pdfs.py` (`ingest_markdown_kb`) → ChromaDB collection used by `services/rag_service.py`.

---

## 1. What changed and why

The previous `knowledge_base_md/*.md` files were raw OCR/text dumps of the scheme PDFs: unstructured, missing current figures, and weakly retrievable. Every file has been **rewritten from scratch** as a structured, RAG-optimized document that:

- **Researches each scheme from live official sources** (PIB, ministry/scheme portals, MyScheme) and **merges** that with the original PDF text, preferring the **newest** official information (e.g. 2025-26 budget changes, latest enrolment numbers, current instalment dates).
- **Preserves the full original PDF text** verbatim in a `Full Official Text` section for maximum recall, while adding researched, structured sections on top.
- **Marks anything not verifiable from official sources** as *"Not available from official sources"* rather than inventing details.
- **Adds inline `_Source:_` citations** at section level so answers can be grounded.
- Is **backend-compatible by construction** (see §4).

## 2. Source-of-truth & verification

Each scheme was cross-checked against its official portal and the latest PIB / ministry releases available as of June 2026. Where the PDF and the live source disagreed, the **newer official figure was used** and noted in `Latest Updates`. Key portals used include pmkisan.gov.in, pmfby.gov.in, jansuraksha.gov.in, pmjdy.gov.in, nfsa.gov.in / dfpd.gov.in, mudra.org.in, standupmitra.in, pmvbry.epfindia.gov.in, skillindiadigital.gov.in, ugc.gov.in, scholarships.gov.in, icar.org.in, and myscheme.gov.in, alongside PIB press releases.

> **Disclaimer carried into the files:** scheme parameters change with budgets and notifications. Each file is stamped `last_updated: 2026-06` and directs users to the official portal/helpline for the live position.

## 3. Files regenerated (18)

| # | Scheme (file) | Source PDF | FAQs | Keywords | Sections | Key current updates baked in |
|---|---------------|-----------|:----:|:--------:|:--------:|------------------------------|
| 1 | **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)**<br>`kissan_samman_nidhi.md` | `kissan samman nidhi.pdf` | 34 | 88 | 29 | 23rd instalment released 20 Jun 2026; e-KYC mandatory; Rs. 6,000/yr in 3 instalments. |
| 2 | **Kisan Credit Card (KCC)**<br>`kisan_credit_card.md` | `kisan credit card.pdf` | 33 | 81 | 29 | Collateral-free limit raised to Rs. 2 lakh (Jan 2025); MISS limit Rs. 5 lakh (Budget 2025-26). |
| 3 | **Pradhan Mantri Fasal Bima Yojana (PMFBY)**<br>`fasal_bima_yojna.md` | `fasal bima yojna.pdf` | 33 | 84 | 29 | Premiums 2%/1.5%/5%; voluntary since 2020; tech additions YES-TECH/WINDS/AIDE; helpline 14447. |
| 4 | **Atal Pension Yojana (APY)**<br>`atal_pension_yojna.md` | `atal pension yojna.pdf` | 34 | 77 | 29 | Extended to FY2030-31 (Cabinet, Jan 2026); ~9 crore enrolments; no income-tax payers since Oct 2022. |
| 5 | **Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)**<br>`pradhan_mantri_jeevan_jyoti_bima_yojna.md` | `pradhan mantri jeevan jyoti bima yojna.pdf` | 33 | 84 | 29 | Premium Rs. 436/yr; 27.43 crore enrolments (Apr 2026); Rs. 2 lakh life cover. |
| 6 | **Pradhan Mantri Suraksha Bima Yojana (PMSBY)**<br>`suraksha_bina_yojna.md` | `suraksha bina yojna.pdf` | 33 | 81 | 29 | Premium Rs. 20/yr; ~56.15 crore enrolments (Jan 2026); Rs. 2 lakh accident cover. |
| 7 | **Pradhan Mantri Jan Dhan Yojana (PMJDY)**<br>`pradhan_mantri_jan_dhan_dhan_yojna.md` | `pradhan mantri jan dhan dhan yojna.pdf` | 33 | 82 | 29 | 56-57 crore accounts; OD up to Rs. 10,000 (age 18-65); RuPay accident cover Rs. 2 lakh. |
| 8 | **Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)**<br>`pradhan_mantri_garib_kalyan_anna_yojna.md` | `pradhan mantri garib kalyan anna yojna.pdf` | 33 | 86 | 29 | Free grain extended to Dec 2028; ~81.35 crore beneficiaries; Mera Ration 2.0; ONORC. |
| 9 | **Pradhan Mantri MUDRA Yojana (PMMY)**<br>`pradhan_mantri_mudra_yojna.md` | `pradhan mantri mudra yojna.pdf` | 33 | 80 | 29 | Limit raised to Rs. 20 lakh via new 'Tarun Plus' (24 Oct 2024); collateral-free. |
| 10 | **Stand-Up India**<br>`stand_up_india_scheme_for_buisness.md` | `stand up india scheme for buisness.pdf` | 33 | 78 | 29 | Rs. 10 lakh-1 crore for SC/ST & women greenfield ventures; ~80% women beneficiaries. |
| 11 | **Pradhan Mantri Viksit Bharat Rozgar Yojana (PM-VBRY)**<br>`pradhan_mantri_viksit_bharat_rozgar_yojna.md` | `pradhan mantri viksit bharat rozgar yojna.pdf` | 33 | 87 | 29 | New ELI scheme (PM-VBRY): up to Rs. 15,000 first-timer benefit; window 1 Aug 2025-31 Jul 2027. |
| 12 | **Pradhan Mantri Kaushal Vikas Yojana - Short Term Training (PMKVY 4.0)**<br>`pm_kaushal_vikas_yojna.md` | `pm kaushal vikas yojna.pdf` | 33 | 89 | 29 | PMKVY 4.0 under Skill India Programme (approved Mar 2025); 400+ new-age courses; free STT. |
| 13 | **Skill Loan Scheme (Model Skill Loan Scheme)**<br>`skill_loan_scheme.md` | `skill loan scheme.pdf` | 33 | 78 | 29 | Revamped Model Skill Loan: limit raised to Rs. 7.5 lakh (Budget 2024-25); 75% NCGTC guarantee. |
| 14 | **CBSE Merit Scholarship Scheme for Single Girl Child (SGC)**<br>`cbse_merit_scholarship_scheme_for_single_girl_child.md` | `CBSE merit scholarship scheme for single girl child.pdf` | 33 | 84 | 29 | Rs. 1,000/month x 2 years; 70%+ Class 10; fee & Rs. 8 lakh income ceilings. |
| 15 | **Post Graduate Indira Gandhi Scholarship for Single Girl Child (PG-IGSSGC)**<br>`post_graduate_scholarship_for_single_girl_child.md` | `post graduate scholarship for single girl child.pdf` | 33 | 89 | 29 | UGC Indira Gandhi SGC: Rs. 36,200/yr x 2; ~3,000 awards/yr; via NSP. |
| 16 | **National Scholarship for Post Graduate Studies (NSPG)**<br>`national_scholarship_for_post_graduate_studies.md` | `national scholarship for post graduate studies.pdf` | 33 | 81 | 29 | Rs. 15,000/month x 10 months; first full-time PG; under 30; via NSP (OTR/FaceAuth). |
| 17 | **National Talent Scholarship (Undergraduate) - ICAR**<br>`national_talent_scholarship_undergraduate.md` | `national talent scholarship undergraduate.pdf` | 33 | 79 | 29 | ICAR NTS: Rs. 3,000/month; AIEE admission; study outside home State. |
| 18 | **Junior Research Fellowship in Engineering & Technology (UGC)**<br>`junior_research_fellowship_in_engineering_and_technology.md` | `junior research fellowship in engineering and technology.pdf` | 33 | 85 | 29 | UGC JRF (Eng & Tech): ~50 slots/yr; 2 yr JRF + 3 yr SRF; direct interview. |

*Every file also contains: Basic Information, Storytelling, Why-This-Exists, Key Benefits, Eligibility, Hidden/Special Conditions, Required Documents, step-by-step Application Process, Processing/Verification/Approval, Rejection Reasons, Renewal/Cancellation, State Variations, Latest Updates, Official Links, a Decision Helper, a Comparison with related schemes, Who-Should / Who-Should-Not-Apply, Metadata, and the Full Official Text.*

## 4. Backend compatibility (verified)

Validated against the actual ingestion and validation code:

- **Filenames** match the existing `knowledge_base_md/` slugs **exactly** (18/18) — files drop in as replacements; the PDF→slug mapping in `ingest_pdfs.py` resolves unchanged.
- **Frontmatter** uses only single-line `key: value` pairs, so the backend's naive `split(':', 1)` parser extracts every field, including the retrieval-critical `scheme_name`, `tags`, and `source_pdf`.
- **Chunking:** bodies split on `##` H2 headings; topic sections are self-contained and sit under the 1,300-char single-chunk threshold, so each becomes one coherent retrieval passage. Long `Generated FAQs` and `Full Official Text` sections sub-split with overlap (by design, for recall). Simulated with the backend's `RecursiveCharacterTextSplitter(1200/150)`: **~780 retrieval chunks total (~43/scheme).**
- **`scripts/validate_kb.py` score: 100/100 on all 18 files** (the 7 required H2 headings — Overview, Key Benefits, Eligibility Criteria, Required Documents, Application Process, Generated FAQs, Full Official Text — are all present with substantive content), up from the crude originals.
- All files are valid **UTF-8**.

## 5. RAG optimizations

- **30+ FAQs per file** (33-34 typical) phrased the way citizens actually ask ("how much will I get", "why was my application rejected", "am I eligible"), each a self-contained Q&A chunk.
- **~80-90 curated keywords + multilingual aliases** (English + Hindi/transliterated) per file in frontmatter and a Keywords section, improving recall for vernacular queries.
- **Self-contained sections** with repeated scheme context so each retrieved chunk makes sense alone.
- **Decision Helper / Who-Should-Apply / Comparison** sections to support advisory answers, not just facts.

## 6. Deliverables in this package

- `knowledge_base_md/*.md` — 18 regenerated scheme files (drop-in for `backend/data/knowledge_base_md/`).
- `knowledge_base_md/metadata.json` — per-file metadata (FAQ/keyword/section counts, sizes, sources).
- `CHANGELOG.md` — this file.

## 7. How to deploy

1. Copy the 18 `.md` files into `backend/data/knowledge_base_md/` (overwriting the old ones).
2. Re-run the ingestion to rebuild the vector store, e.g. `python scripts/ingest_pdfs.py` (and/or `scripts/build_md_kb.py` per your setup).
3. Optionally run `python scripts/validate_kb.py` to confirm 100/100 scores.
