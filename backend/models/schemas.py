from pydantic import BaseModel
from typing import Optional, List

class PolicyQuery(BaseModel):
    query: str
    language: str = "en"
    state: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: str = "en"

class CompareRequest(BaseModel):
    scheme1: str
    scheme2: str
    language: str = "en"

class ExplainerResponse(BaseModel):
    title: str
    what_is: str
    why_introduced: str
    benefits: List[str]
    eligibility: List[str]
    documents: List[str]
    how_to_apply: str
    deadlines: Optional[str]
    misunderstood_clauses: List[str]
    source: str
    ministry: str
    last_updated: str
    confidence: str
    disclaimer: str

class ConditionItem(BaseModel):
    text: str
    severity: str
    explanation: str

class ConditionResponse(BaseModel):
    conditions: List[ConditionItem]
    summary: str

class ComparisonItem(BaseModel):
    aspect: str
    scheme1_value: str
    scheme2_value: str

class ComparisonResponse(BaseModel):
    scheme1_name: str
    scheme2_name: str
    comparisons: List[ComparisonItem]
    recommendation: Optional[str]

class DashboardStats(BaseModel):
    total_beneficiaries: str
    total_funds_disbursed: str
    state_coverage: List[dict]
    last_updated: str
    source: str
    top_schemes: Optional[List[dict]] = None

class ChatResponse(BaseModel):
    reply: str
    sources: List[str]
    confidence: str

class ELI5Response(BaseModel):
    story: str
    simple_explanation: str
    everyday_example: str
    key_takeaway: str
