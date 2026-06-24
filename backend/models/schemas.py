from pydantic import BaseModel, Field
from typing import Optional, List


class PolicyQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    language: str = Field(default="en", pattern="^[a-z]{2}$")
    state: Optional[str] = Field(default=None, max_length=100)


class CompareRequest(BaseModel):
    scheme1: str = Field(..., min_length=1, max_length=300)
    scheme2: str = Field(..., min_length=1, max_length=300)
    language: str = Field(default="en", pattern="^[a-z]{2}$")


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
