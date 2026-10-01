from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class HistoryItem(BaseModel):
    # protected_namespaces=() se 'model_name' wali Pydantic warning fix ho jayegi
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: int
    headline: Optional[str] = None
    content: Optional[str] = None
    prediction: str
    confidence: Optional[float] = None
    model_name: str
    processing_time_ms: Optional[int] = None
    created_at: datetime


class HistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: List[HistoryItem]
    total: int
    page: int
    page_size: int
    pages: int