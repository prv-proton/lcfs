from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ChatDocument(BaseModel):
    document_id: str = Field(..., examples=["abc123"])
    name: str
    created_at: datetime
    chunk_count: int


class ChatSource(BaseModel):
    document_id: str
    document_name: str
    snippet: str
    score: float


class ChatQuery(BaseModel):
    question: str = Field(..., min_length=3)
    document_ids: Optional[List[str]] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource] = []
