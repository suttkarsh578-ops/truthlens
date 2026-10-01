from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class LiveNewsArticle(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    source_name: Optional[str] = None
    author: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    category: Optional[str] = None


class LiveNewsResponse(BaseModel):
    status: str
    total_results: int
    articles: List[LiveNewsArticle]
    category: Optional[str] = None
    search: Optional[str] = None
    is_cached: bool = False
    message: Optional[str] = None
