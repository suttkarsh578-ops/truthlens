from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_optional_db
from app.services import news_service

router = APIRouter()


@router.get("")
@router.get("/")
async def get_live_news(
    category: Optional[str] = Query(None, description="News category filter (world, business, technology, etc.)"),
    country: Optional[str] = Query("in", description="Country code (in, us, gb, etc.)"),
    language: Optional[str] = Query("en", description="Language code"),
    search: Optional[str] = Query(None, description="Search keyword/term"),
    page: int = Query(1, ge=1, le=10, description="Page number"),
    limit: int = Query(100, ge=1, le=100, description="Articles per page (up to 100)"),
    db: Session = Depends(get_optional_db)
):
    """
    Fetch live news headlines from external provider (GNews) or PostgreSQL cache.
    """
    result = await news_service.fetch_live_news(
        db=db,
        category=category,
        search=search,
        country=country or "us",
        language=language or "en",
        limit=limit,
        page=page
    )
    return result
