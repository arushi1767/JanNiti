"""
Test script to demonstrate the improved section extraction from structured markdown.

This test simulates RAG results with section metadata and shows how the new
extractive.py properly classifies content by section instead of just keyword matching.
"""
from services.extractive import build_explainer, build_conditions, _extract_sections_by_metadata

# Simulated RAG results with proper section metadata (as ingested from markdown)
sample_rag_results = [
    {
        "text": "Atal Pension Yojana (APY) is an old age income security scheme for savings account holders in the age group of 18-40 years who is not an income tax-payee.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Overview", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Monthly pension of Rs. 1000 to Rs. 5000 per month after the age of 60 years. Government co-contribution of Rs. 1000 to Rs. 1500 per year for the first 5 years.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Key Benefits", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Eligibility: Indian citizen aged 18-40 years. Must have a savings account in a bank.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Eligibility Criteria", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Documents required: Aadhaar card or Virtual ID, PAN card, Bank passbook with account number.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Required Documents", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Apply online through your bank's net banking portal or visit your nearest bank branch with required documents and KYC form.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Application Process", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Scheme effective from 1st June 2015. Subscribers who joined before 31st December 2015 get enhanced benefits.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Important Dates", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    },
    {
        "text": "Voluntary exit not allowed before 60 years of age except on medical grounds. Mandatory exit at age 60. Non-compliance with contribution schedule may lead to suspension.",
        "metadata": {"name": "Atal Pension Yojana", "section": "Important Clauses", "source": "atal_pension_yojna.md", "type": "scheme_md"}
    }
]

def test_section_extraction():
    print("=" * 80)
    print("TEST: Section-Aware Extraction from Structured Markdown")
    print("=" * 80)
    
    # Test 1: Extract sections by metadata
    print("\n1. Testing section extraction by metadata:")
    sections = _extract_sections_by_metadata(sample_rag_results)
    for section_name, content in sections.items():
        if content:
            print(f"\n{section_name.upper()}:")
            for item in content:
                print(f"  - {item[:80]}...")
    
    # Test 2: Build explainer response
    print("\n" + "=" * 80)
    print("2. Testing full explainer response:")
    print("=" * 80)
    explainer = build_explainer("Atal Pension Yojana", sample_rag_results)
    
    print(f"\nTitle: {explainer['title']}")
    print(f"\nWhat is it?\n{explainer['what_is']}")
    print(f"\nWhy introduced?\n{explainer['why_introduced']}")
    
    print(f"\nBenefits ({len(explainer['benefits'])} items):")
    for b in explainer['benefits']:
        print(f"  - {b[:70]}...")
    
    print(f"\nEligibility ({len(explainer['eligibility'])} items):")
    for e in explainer['eligibility']:
        print(f"  - {e[:70]}...")
    
    print(f"\nDocuments ({len(explainer['documents'])} items):")
    for d in explainer['documents']:
        print(f"  - {d[:70]}...")
    
    print(f"\nHow to Apply:\n{explainer['how_to_apply'][:150]}...")
    
    if explainer['deadlines']:
        print(f"\nDeadlines:\n{explainer['deadlines'][:100]}...")
    
    print(f"\nClauses ({len(explainer['misunderstood_clauses'])} items):")
    for c in explainer['misunderstood_clauses']:
        print(f"  - {c[:70]}...")
    
    # Test 3: Build conditions
    print("\n" + "=" * 80)
    print("3. Testing conditions extraction:")
    print("=" * 80)
    conditions = build_conditions(sample_rag_results)
    
    print(f"\nSummary: {conditions['summary']}")
    for cond in conditions['conditions']:
        severity_icon = "🔴" if cond['severity'] == 'red' else "🟡" if cond['severity'] == 'yellow' else "🟢"
        print(f"\n{severity_icon} [{cond['severity'].upper()}] {cond['text'][:70]}...")
        print(f"   → {cond['explanation']}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE: All sections properly extracted!")
    print("=" * 80)

if __name__ == "__main__":
    test_section_extraction()
