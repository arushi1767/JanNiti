"""
Seed the RAG database with built-in Indian government scheme data.
Run automatically on startup if the database is empty.
Can also be run manually: python seed_data.py
"""

SCHEME_DATA = [
    {
        "id": "pmkisan-1",
        "text": """PM Kisan Samman Nidhi (PM-KISAN) is a central government scheme providing income support to all landholding farmer families in India. Eligible farmers receive ₹6,000 per year, paid in three equal installments of ₹2,000 directly into their bank accounts via Direct Benefit Transfer (DBT). The scheme was launched in February 2019 by the Ministry of Agriculture & Farmers Welfare. Eligibility: All landholding farmer families with cultivable land. Exclusions: Institutional landholders; farmers who are or have been holders of constitutional posts; serving/retired government employees; income tax payers; professionals like doctors, engineers, lawyers with land. Documents required: Aadhaar card, land ownership documents, bank account linked to Aadhaar. How to apply: Visit the nearest Common Service Centre (CSC) or apply online at pmkisan.gov.in. The scheme has no application deadline and is ongoing. As of 2025, over 11 crore farmers have benefited. Source: Ministry of Agriculture & Farmers Welfare. Last updated: 2025.""",
        "metadata": {"scheme": "PM Kisan Samman Nidhi", "ministry": "Ministry of Agriculture", "source": "pmkisan.gov.in", "year": "2025"},
    },
    {
        "id": "pmkisan-2",
        "text": """PM Kisan hidden conditions and common misunderstandings: 1) If a farmer's family has even one member who is a government employee or income tax payer, the ENTIRE family is excluded — not just that member. 2) Installments can be stopped if Aadhaar is not seeded to the bank account. 3) Land must be in the farmer's own name — tenant farmers do NOT qualify. 4) If wrong information is submitted during registration, the farmer must repay all installments received, plus a penalty. 5) A 'farmer family' is defined as husband, wife, and minor children — adult children with separate land get separate registration. 6) The scheme only covers agricultural land, not horticultural or plantation land in some states. Always verify eligibility at pmkisan.gov.in before applying.""",
        "metadata": {"scheme": "PM Kisan Samman Nidhi", "ministry": "Ministry of Agriculture", "source": "pmkisan.gov.in", "year": "2025"},
    },
    {
        "id": "ayushman-1",
        "text": """Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) is the world's largest health insurance scheme, providing a health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization. Launched in 2018 by the Ministry of Health & Family Welfare. Eligibility: Families identified in SECC-2011 (Socio-Economic Caste Census) data — approximately 10.74 crore poor and vulnerable families (about 50 crore beneficiaries). No premium is charged to the beneficiary. Covers pre and post hospitalization expenses, day care procedures, and treatment in both public and empanelled private hospitals. Documents: Aadhaar card or ration card (for identification). How to apply: No formal application — check eligibility at pmjay.gov.in or at any empanelled hospital. The scheme is cashless and paperless at the hospital. Source: National Health Authority. Last updated: 2025.""",
        "metadata": {"scheme": "Ayushman Bharat PM-JAY", "ministry": "Ministry of Health", "source": "pmjay.gov.in", "year": "2025"},
    },
    {
        "id": "ayushman-2",
        "text": """Ayushman Bharat PM-JAY important conditions: 1) Coverage is per family (floater basis) — if one member uses ₹5 lakh, no other family member can claim that year. 2) Pre-existing diseases ARE covered from day one — no waiting period. 3) Only diseases on the approved package list (1,949 procedures) are covered — cosmetic surgery and fertility treatments are excluded. 4) You must be admitted to an empanelled hospital — non-empanelled hospitals are NOT covered. 5) There is NO income limit or premium, but you MUST appear in SECC-2011 data — newly poor families not in this list are not covered. 6) If you move cities, coverage is valid at empanelled hospitals across India (portable benefit). 7) No cap on family size — entire family including elderly parents and married children living in same household are covered.""",
        "metadata": {"scheme": "Ayushman Bharat PM-JAY", "ministry": "Ministry of Health", "source": "pmjay.gov.in", "year": "2025"},
    },
    {
        "id": "ujjwala-1",
        "text": """Pradhan Mantri Ujjwala Yojana (PMUY) provides free LPG (cooking gas) connections to women from Below Poverty Line (BPL) households and other deprived categories. Originally launched in 2016, expanded to Ujjwala 2.0 in 2021. Benefits: Free LPG connection with a deposit-free gas cylinder and pressure regulator. First refill and hotplate are also provided free or at subsidized rates. Eligibility for Ujjwala 2.0: Women 18+ who are not existing LPG connection holders; belong to BPL households, SC/ST families, PM Awas Yojana (Gramin) beneficiaries, Most Backward Classes, tea garden workers, forest dwellers, river island residents, or any poor household. Documents: Aadhaar card, ration card or self-declaration of address. Application: Visit the nearest LPG distributor (IndianOil, HPCL, BPCL) or apply online. Ministry: Ministry of Petroleum & Natural Gas. Source: pmuy.gov.in. Last updated: 2024.""",
        "metadata": {"scheme": "PM Ujjwala Yojana", "ministry": "Ministry of Petroleum", "source": "pmuy.gov.in", "year": "2024"},
    },
    {
        "id": "mgnrega-1",
        "text": """Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) guarantees 100 days of wage employment per financial year to every rural household whose adult members volunteer to do unskilled manual work. Launched in 2005. Key features: Employment must be provided within 5 km of the applicant's home; if work is not provided within 15 days, an unemployment allowance is paid; wages are paid directly to workers' bank/post office accounts within 15 days of work completion. Work includes water conservation, drought proofing, irrigation, land development, and rural connectivity. How to apply: Submit a written application (or verbal application) to the Gram Panchayat. A job card (MGNREGA card) is issued free of charge within 15 days. There is no income limit — any adult rural resident can apply. Ministry: Ministry of Rural Development. Source: nrega.nic.in. Last updated: 2025.""",
        "metadata": {"scheme": "MGNREGA", "ministry": "Ministry of Rural Development", "source": "nrega.nic.in", "year": "2025"},
    },
    {
        "id": "mgnrega-2",
        "text": """MGNREGA rights and obligations: 1) The 100 days is per HOUSEHOLD, not per person — all family members together can work a maximum of 100 days total. 2) If you provide false information about residence or identity, your job card can be cancelled and wages recovered. 3) Wages can be reduced if work is not completed to standard — productivity norms apply. 4) Workers must report for work within the time given in the work schedule; absence without leave can affect future employment. 5) The unemployment allowance (if work is not provided within 15 days) is 25% of wage rate for first 30 days, then 50% — it is an obligation on the government, but only triggered by a formal written demand for work. 6) Worksite facilities (shade, water, creche for children) must be provided but many sites do not comply — workers can file complaints at nrega.nic.in.""",
        "metadata": {"scheme": "MGNREGA", "ministry": "Ministry of Rural Development", "source": "nrega.nic.in", "year": "2025"},
    },
    {
        "id": "pmawas-1",
        "text": """Pradhan Mantri Awas Yojana (PMAY) aims to provide housing for all by 2024. It has two components: PMAY-Gramin (rural) and PMAY-Urban. PMAY-Gramin: Provides financial assistance of ₹1.2 lakh (plain areas) or ₹1.3 lakh (hilly/difficult areas) to eligible rural BPL households to construct a pucca house. PMAY-Urban: Provides subsidized home loans for EWS (Economically Weaker Section), LIG (Lower Income Group), and MIG (Middle Income Group) categories. Under Credit Linked Subsidy Scheme (CLSS), interest subsidy of 3-6.5% is given on home loans. Eligibility: Families without a pucca house; beneficiaries identified through SECC data (rural) or municipal records (urban). Documents: Aadhaar, BPL certificate, land documents, bank account. Application: Through Gram Panchayat (rural) or Urban Local Body/bank (urban). Ministry: Ministry of Housing & Urban Affairs. Source: pmaymis.gov.in. Last updated: 2024.""",
        "metadata": {"scheme": "PM Awas Yojana", "ministry": "Ministry of Housing", "source": "pmaymis.gov.in", "year": "2024"},
    },
    {
        "id": "sukanya-1",
        "text": """Sukanya Samriddhi Yojana (SSY) is a small savings scheme for the girl child, offering one of the highest interest rates among government schemes. Key features: Account can be opened at any post office or authorized bank branch for girls under age 10. Minimum deposit ₹250 per year, maximum ₹1.5 lakh per year. Current interest rate: 8.2% per annum (compounded annually, revised quarterly). Tax benefits: Deposits, interest, and maturity amount are all tax-free (EEE category). Account matures after 21 years from opening, or when the girl turns 21. Partial withdrawal of up to 50% is allowed after the girl turns 18 (for education or marriage). Maximum 2 accounts per family (one per girl child); 3 accounts allowed in case of twin girls. Documents: Girl's birth certificate, Aadhaar, guardian's ID and address proof. Ministry: Ministry of Finance. Source: India Post / authorized banks. Last updated: 2025.""",
        "metadata": {"scheme": "Sukanya Samriddhi Yojana", "ministry": "Ministry of Finance", "source": "indiapost.gov.in", "year": "2025"},
    },
    {
        "id": "pmkvy-1",
        "text": """Pradhan Mantri Kaushal Vikas Yojana (PMKVY) is the flagship skill development scheme of India. Under PMKVY 4.0 (2022-2026), it provides free short-term skill training (200-600 hours) and monetary rewards to youth. Eligible: Indian citizens between 15-45 years. Training sectors: IT, healthcare, construction, automobile, retail, BFSI, and 30+ other sectors. Monetary reward: ₹8,000-₹15,000 upon successful assessment. Recognition of Prior Learning (RPL): Workers with existing skills can get certified without full training. Training is provided at PMKVY-affiliated training centres. Documents: Aadhaar, bank account, age proof. Post-training: Placement assistance is provided. Apply at skillindia.gov.in or nearest PMKVY training centre. Ministry: Ministry of Skill Development & Entrepreneurship. Source: pmkvyofficial.org. Last updated: 2025.""",
        "metadata": {"scheme": "PM Kaushal Vikas Yojana", "ministry": "Ministry of Skill Development", "source": "pmkvyofficial.org", "year": "2025"},
    },
    {
        "id": "mudra-1",
        "text": """Pradhan Mantri Mudra Yojana (PMMY) provides collateral-free loans to micro and small businesses. Three loan categories: Shishu (up to ₹50,000) for startups; Kishor (₹50,001 to ₹5 lakh) for expanding businesses; Tarun (₹5 lakh to ₹10 lakh) for well-established businesses. Eligible: Non-farm income-generating businesses — traders, shopkeepers, artisans, small manufacturers, hawkers. No collateral or security required. Apply through any bank, NBFC, MFI, or online at mudra.org.in. Key benefit: A Mudra card (like a debit card) is issued to draw working capital as needed. Interest rates vary by lender (typically 10-12%). Over 45 crore loans worth ₹27 lakh crore disbursed since 2015. Important: MUDRA does NOT directly lend money — it is a guarantee institution. You apply at a bank/NBFC. Ministry: Ministry of Finance. Source: mudra.org.in. Last updated: 2025.""",
        "metadata": {"scheme": "PM Mudra Yojana", "ministry": "Ministry of Finance", "source": "mudra.org.in", "year": "2025"},
    },
    {
        "id": "svanidhi-1",
        "text": """PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi) provides affordable working capital loans to street vendors affected by COVID-19 and for livelihood restoration. Loan structure: First loan ₹10,000; on repayment, second loan ₹20,000; third loan ₹50,000. Interest subsidy of 7% on timely repayment. Digital transactions incentive: Cashback of up to ₹1,200 per year for UPI transactions. Eligibility: Street vendors operating in urban areas with a Certificate of Vending or Letter of Recommendation from Urban Local Body. No collateral needed. Apply online at pmsvanidhi.mohua.gov.in or through CSC centres or lending institutions. This scheme also covers vendors who operate without a certificate if their vendor identity is verified. Ministry: Ministry of Housing & Urban Affairs. Source: pmsvanidhi.mohua.gov.in. Last updated: 2024.""",
        "metadata": {"scheme": "PM SVANidhi", "ministry": "Ministry of Housing", "source": "pmsvanidhi.mohua.gov.in", "year": "2024"},
    },
    {
        "id": "pmmvy-1",
        "text": """Pradhan Mantri Matru Vandana Yojana (PMMVY) is a maternity benefit scheme providing cash incentive of ₹5,000 to pregnant women and lactating mothers. Applicable for the first living child. Payment is in two installments: ₹3,000 on early registration of pregnancy and ₹2,000 after delivery and registration of birth. For second child (if girl): additional ₹6,000 is given in one installment under PMMVY 2.0. Eligibility: All pregnant women and lactating mothers except those who are central/state government employees or already receiving maternity benefits under any law. No income limit. Conditions: Must register pregnancy at an Aanganwadi Centre (AWC) or approved health facility; must attend ante-natal check-ups; infant must receive recommended vaccinations. Documents: Aadhaar, bank account, MCP card (Mother & Child Protection card). Apply at Aanganwadi Centre. Ministry: Ministry of Women & Child Development. Source: wcd.nic.in. Last updated: 2025.""",
        "metadata": {"scheme": "PM Matru Vandana Yojana", "ministry": "Ministry of Women & Child Development", "source": "wcd.nic.in", "year": "2025"},
    },
    {
        "id": "pmfby-1",
        "text": """Pradhan Mantri Fasal Bima Yojana (PMFBY) provides financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests, and diseases. Premium: Farmers pay only 2% of sum insured for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops. The rest of the premium is shared between state and central governments. Coverage: Pre-sowing to post-harvest losses including cyclone, hailstorm, inundation. Sum insured is based on the scale of finance (loan amount). For loanee farmers: enrollment is automatic through the bank. For non-loanee farmers: voluntary enrollment through bank, CSC, or crop insurance portal (pmfby.gov.in). Deadline: 2 weeks before sowing for Kharif; 2 weeks before sowing for Rabi. Claim settlement within 2 months of harvest. Ministry: Ministry of Agriculture. Source: pmfby.gov.in. Last updated: 2025.""",
        "metadata": {"scheme": "PM Fasal Bima Yojana", "ministry": "Ministry of Agriculture", "source": "pmfby.gov.in", "year": "2025"},
    },
    {
        "id": "jaljeevan-1",
        "text": """Jal Jeevan Mission (JJM) aims to provide safe and adequate drinking water through individual household tap connections (Functional Household Tap Connection - FHTC) to every rural household by 2024 (extended to 2028). Target: 19.4 crore rural households. Benefits: 55 litres per capita per day of potable piped water supply. No direct application needed from individuals — implementation is done through Gram Panchayat/Village Water Sanitation Committees. Citizens can check their village's status and report complaints at jaljeevanmission.gov.in. Funding: 90% central government, 10% state government (90:10 for NE/hilly states it is 100:0). Quality testing: Water sources are tested at district and sub-district labs. Ministry: Ministry of Jal Shakti. Source: jaljeevanmission.gov.in. Last updated: 2025.""",
        "metadata": {"scheme": "Jal Jeevan Mission", "ministry": "Ministry of Jal Shakti", "source": "jaljeevanmission.gov.in", "year": "2025"},
    },
    {
        "id": "nsap-1",
        "text": """National Social Assistance Programme (NSAP) provides financial assistance to elderly, widows, and disabled persons belonging to Below Poverty Line (BPL) households. Components: 1) Indira Gandhi National Old Age Pension Scheme (IGNOAPS): ₹200-₹500/month for BPL elderly (60+); 2) Indira Gandhi National Widow Pension Scheme (IGNWPS): ₹300/month for BPL widows aged 40-79; 3) Indira Gandhi National Disability Pension Scheme (IGNDPS): ₹300/month for severely disabled BPL persons aged 18-79; 4) National Family Benefit Scheme (NFBS): ₹20,000 lump sum to BPL family on death of the primary breadwinner (18-64 years). How to apply: Contact the District Collector/Social Welfare Officer or the Gram Panchayat. BPL certification is required. Ministry: Ministry of Rural Development. Source: nsap.nic.in. Last updated: 2024.""",
        "metadata": {"scheme": "National Social Assistance Programme", "ministry": "Ministry of Rural Development", "source": "nsap.nic.in", "year": "2024"},
    },
]


def seed_database(rag_service) -> int:
    """Seed the RAG service with scheme data. Returns number of documents added."""
    texts = [d["text"] for d in SCHEME_DATA]
    metadatas = [d["metadata"] for d in SCHEME_DATA]
    ids = [d["id"] for d in SCHEME_DATA]

    rag_service.add_documents_batch(texts, metadatas, ids)
    return len(SCHEME_DATA)


if __name__ == "__main__":
    import sys
    sys.path.insert(0, ".")
    from services.rag_service import rag_service
    print(f"Current document count: {rag_service.count_documents()}")
    print("Seeding database...")
    count = seed_database(rag_service)
    print(f"Done! Added {count} documents. Total: {rag_service.count_documents()}")
