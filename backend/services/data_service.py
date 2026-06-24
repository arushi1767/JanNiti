import os
import requests
from typing import Optional, List, Dict
from datetime import datetime

DATAGOV_BASE = "https://api.data.gov.in/resource"
DATAGOV_API_KEY = os.getenv("DATAGOV_API_KEY", "")

# NOTE: dashboard stats are curated from official PIB/Annual Report sources.
# They reflect last verified figures and are updated manually each quarter.
# This is clearly labeled in the UI - not claimed as "live" data.
DASHBOARD_STATS = {
    "total_beneficiaries": "78+ Crore citizens reached across all central schemes",
    "total_funds_disbursed": "₹12.5+ Lakh Crore (FY 2024-25 budget allocation)",
    "state_coverage": [
        {"state": "Uttar Pradesh", "schemes": 45, "beneficiaries": "15.2 Cr"},
        {"state": "Maharashtra", "schemes": 42, "beneficiaries": "8.7 Cr"},
        {"state": "Bihar", "schemes": 40, "beneficiaries": "7.8 Cr"},
        {"state": "Madhya Pradesh", "schemes": 38, "beneficiaries": "5.6 Cr"},
        {"state": "Rajasthan", "schemes": 36, "beneficiaries": "5.1 Cr"},
        {"state": "West Bengal", "schemes": 35, "beneficiaries": "6.4 Cr"},
        {"state": "Tamil Nadu", "schemes": 34, "beneficiaries": "4.8 Cr"},
        {"state": "Karnataka", "schemes": 33, "beneficiaries": "4.2 Cr"},
        {"state": "Gujarat", "schemes": 32, "beneficiaries": "3.9 Cr"},
        {"state": "Odisha", "schemes": 30, "beneficiaries": "3.1 Cr"},
    ],
    "source": "PIB Press Releases, Ministry Annual Reports 2024-25 (figures as of March 2025)",
    "top_schemes": [
        {"name": "PM Kisan Samman Nidhi", "beneficiaries": "11+ Crore farmers", "funds": "₹2.4 Lakh Cr"},
        {"name": "Ayushman Bharat PM-JAY", "beneficiaries": "30+ Crore beneficiaries", "funds": "₹6,400 Cr"},
        {"name": "PM Ujjwala Yojana", "beneficiaries": "10.3+ Crore connections", "funds": "₹1.3 Lakh Cr"},
        {"name": "PM Awas Yojana", "beneficiaries": "4+ Crore houses", "funds": "₹2.5 Lakh Cr"},
        {"name": "MGNREGA", "beneficiaries": "15+ Crore households", "funds": "₹1.2 Lakh Cr"},
    ],
}

# Deduplicated scheme list (removed duplicate Sukanya Samriddhi Yojana)
SCHEMES_DB: List[Dict] = [
    {"id": "pm-kisan", "name": "PM Kisan Samman Nidhi", "ministry": "Ministry of Agriculture & Farmers Welfare", "type": "Central", "keywords": ["kisan", "farmer", "agriculture", "samman", "nidhi"]},
    {"id": "ayushman", "name": "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana", "ministry": "Ministry of Health & Family Welfare", "type": "Central", "keywords": ["ayushman", "health", "insurance", "hospital", "pmjay", "arogya"]},
    {"id": "pm-ujjwala", "name": "Pradhan Mantri Ujjwala Yojana", "ministry": "Ministry of Petroleum & Natural Gas", "type": "Central", "keywords": ["ujjwala", "lpg", "gas", "cylinder", "fuel", "cooking"]},
    {"id": "pm-awas", "name": "Pradhan Mantri Awas Yojana", "ministry": "Ministry of Housing & Urban Affairs", "type": "Central", "keywords": ["awas", "housing", "home", "ghar", "house"]},
    {"id": "mgnrega", "name": "Mahatma Gandhi National Rural Employment Guarantee Act", "ministry": "Ministry of Rural Development", "type": "Central", "keywords": ["mgnrega", "employment", "work", "rural", "rozgar", "job", "100 days"]},
    {"id": "pm-shram", "name": "Pradhan Mantri Shram Yogi Maan-dhan", "ministry": "Ministry of Labour & Employment", "type": "Central", "keywords": ["shram", "labour", "worker", "pension", "unorganised"]},
    {"id": "sukanya", "name": "Sukanya Samriddhi Yojana", "ministry": "Ministry of Finance", "type": "Central", "keywords": ["sukanya", "girl", "daughter", "savings", "samridhi", "ssy"]},
    {"id": "pm-poshan", "name": "PM POSHAN (Mid-Day Meal) Scheme", "ministry": "Ministry of Education", "type": "Central", "keywords": ["poshan", "mid day meal", "school", "nutrition", "midday", "lunch"]},
    {"id": "skill-india", "name": "Pradhan Mantri Kaushal Vikas Yojana", "ministry": "Ministry of Skill Development & Entrepreneurship", "type": "Central", "keywords": ["skill", "kaushal", "training", "pmkvy", "vocational"]},
    {"id": "pm-mudra", "name": "Pradhan Mantri Mudra Yojana", "ministry": "Ministry of Finance", "type": "Central", "keywords": ["mudra", "loan", "business", "self employed", "micro", "shishu", "kishor", "tarun"]},
    {"id": "pm-svanidhi", "name": "PM Street Vendor's AtmaNirbhar Nidhi", "ministry": "Ministry of Housing & Urban Affairs", "type": "Central", "keywords": ["svanidhi", "street vendor", "hawker", "rehdi", "patri", "loan"]},
    {"id": "nsap", "name": "National Social Assistance Programme", "ministry": "Ministry of Rural Development", "type": "Central", "keywords": ["nsap", "social assistance", "pension", "widow", "disability", "old age"]},
    {"id": "stand-up-india", "name": "Stand Up India", "ministry": "Ministry of Finance", "type": "Central", "keywords": ["stand up", "sc st", "women entrepreneur", "bank loan", "startup"]},
    {"id": "pmfby", "name": "Pradhan Mantri Fasal Bima Yojana", "ministry": "Ministry of Agriculture & Farmers Welfare", "type": "Central", "keywords": ["fasal", "crop", "insurance", "bima", "kharif", "rabi"]},
    {"id": "jal-jeevan", "name": "Jal Jeevan Mission (Har Ghar Jal)", "ministry": "Ministry of Jal Shakti", "type": "Central", "keywords": ["jal jeevan", "water", "tap", "nal", "har ghar"]},
    {"id": "pm-daksh", "name": "PM Daksh Yojana", "ministry": "Ministry of Social Justice & Empowerment", "type": "Central", "keywords": ["daksh", "obc", "sc", "safai karamcharis", "skill training"]},
    {"id": "matru-vandana", "name": "Pradhan Mantri Matru Vandana Yojana", "ministry": "Ministry of Women & Child Development", "type": "Central", "keywords": ["matru vandana", "maternity", "pregnancy", "mother", "pmmvy"]},
    {"id": "pm-gatishakti", "name": "PM GatiShakti National Master Plan", "ministry": "Ministry of Commerce & Industry", "type": "Central", "keywords": ["gatishakti", "infrastructure", "logistics", "connectivity"]},
    {"id": "pmvvy", "name": "Pradhan Mantri Vaya Vandana Yojana", "ministry": "Ministry of Finance", "type": "Central", "keywords": ["vaya vandana", "senior citizen", "pension", "elderly", "old age", "pmvvy"]},
]


async def get_dashboard_stats() -> Dict:
    stats = dict(DASHBOARD_STATS)
    stats["last_updated"] = "March 2025 (PIB Annual Reports)"
    return stats


async def search_schemes(query: str) -> List[Dict]:
    """Improved search: exact match → keyword match → partial word match."""
    q = query.lower().strip()
    if not q:
        return []

    exact, keyword, partial = [], [], []

    for scheme in SCHEMES_DB:
        name_lower = scheme["name"].lower()
        keywords = scheme.get("keywords", [])

        if q in name_lower:
            exact.append(scheme)
        elif any(kw in q or q in kw for kw in keywords):
            keyword.append(scheme)
        elif any(word in name_lower for word in q.split() if len(word) > 2):
            partial.append(scheme)

    # Deduplicate preserving order
    seen, results = set(), []
    for s in exact + keyword + partial:
        if s["id"] not in seen:
            seen.add(s["id"])
            results.append({k: v for k, v in s.items() if k != "keywords"})

    return results[:10]


async def fetch_datagov_scheme_data(scheme_id: str) -> Optional[Dict]:
    """Fetch live data from data.gov.in if API key is configured."""
    if not DATAGOV_API_KEY:
        return None
    scheme = next((s for s in SCHEMES_DB if s["id"] == scheme_id), None)
    if not scheme:
        return None
    # data.gov.in integration placeholder — requires real resource UUIDs from the portal
    return None
