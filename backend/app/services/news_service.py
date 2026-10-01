import asyncio
import httpx
import time
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.config import settings
from app.core.logging import get_logger
from app.models.live_news_cache import LiveNewsCache

logger = get_logger("truthlens.news_service")

GNEWS_BASE_URL = "https://gnews.io/api/v4"

VALID_CATEGORIES = {
    "general", "world", "nation", "business", 
    "technology", "entertainment", "sports", "science", "health"
}

# Fast in-memory cache to guarantee zero-latency responses and protect against rate limits
# Structure: { key: { "timestamp": float, "articles": list } }
_MEMORY_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes in-memory TTL


# Topic keyword heuristics for smart categorisation
TOPIC_KEYWORDS = {
    "SPORTS": ["nfl", "nba", "fifa", "cup", "league", "coach", "game", "quarterback", "touchdown", "broncos", "rams", "patriots", "messi", "ronaldo", "stadium", "tournament", "championship", "tennis", "cricket", "olympics", "race", "racing", "super cup"],
    "TECHNOLOGY": ["ai", "artificial intelligence", "chip", "semiconductor", "nvidia", "apple", "google", "microsoft", "openai", "software", "cybersecurity", "hardware", "smartphone", "robot", "cloud", "tech", "quantum", "processor", "meta"],
    "BUSINESS": ["stock", "market", "economy", "inflation", "fed", "bank", "investor", "revenue", "oil", "crude", "trade", "tariff", "shares", "dollar", "nasdaq", "dow", "crypto", "bitcoin", "earnings", "wall street", "finances"],
    "HEALTH": ["health", "vaccine", "cancer", "medical", "doctor", "hospital", "fda", "drug", "disease", "treatment", "therapy", "nutrition", "study", "surgery", "diet", "virus", "symptoms", "clinical trial"],
    "ENTERTAINMENT": ["movie", "film", "hollywood", "actor", "actress", "music", "album", "song", "grammy", "oscar", "emmy", "netflix", "disney", "concert", "celebrity", "star", "box office", "show"],
    "POLITICS": ["senate", "congress", "president", "biden", "trump", "election", "vote", "voters", "white house", "court", "justice", "lawmaker", "governor", "democrat", "republican", "bill", "legislation", "parliament"],
    "WORLD": ["ukraine", "russia", "israel", "gaza", "china", "taiwan", "nato", "un", "united nations", "europe", "middle east", "treaty", "ambassador", "diplomacy", "global", "border", "foreign", "geneva"]
}

def detect_article_category(title: str, description: Optional[str], current_category: Optional[str]) -> str:
    """Smartly infer the most accurate category from title and description keywords."""
    c_lower = (current_category or "").lower()
    if c_lower in VALID_CATEGORIES and c_lower not in ("general", "all", "nation"):
        return c_lower.upper()

    text_to_check = f"{title or ''} {description or ''}".lower()
    for cat_name, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            # Word boundary search or substring for exact match
            if f" {kw} " in f" {text_to_check} " or f" {kw}s " in f" {text_to_check} ":
                return cat_name
                
    return "WORLD" if c_lower in ("general", "nation", "all", "") else c_lower.upper()


def parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    if not dt_str:
        return None
    try:
        cleaned_str = dt_str.replace("Z", "+00:00")
        return datetime.fromisoformat(cleaned_str)
    except Exception:
        try:
            return datetime.strptime(dt_str[:19], "%Y-%m-%dT%H:%M:%S")
        except Exception:
            return None


def get_cached_news_db(
    db: Optional[Session],
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """Retrieve recent cached news from PostgreSQL database if accessible."""
    if not db:
        return []
    try:
        query = db.query(LiveNewsCache)
        
        if category and category.lower() not in ("all", "general", ""):
            query = query.filter(LiveNewsCache.category.ilike(f"%{category.lower()}%"))
            
        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                (LiveNewsCache.title.ilike(term)) | (LiveNewsCache.description.ilike(term))
            )
            
        cached_rows = query.order_by(desc(LiveNewsCache.published_at), desc(LiveNewsCache.created_at)).limit(limit).all()
        
        results = []
        for row in cached_rows:
            inferred_cat = detect_article_category(row.title, row.description, row.category)
            results.append({
                "id": row.id,
                "title": row.title,
                "description": row.description,
                "content": row.content or row.description or row.title,
                "source_name": row.source_name,
                "author": row.author,
                "url": row.url,
                "image_url": row.image_url,
                "published_at": row.published_at.isoformat() if row.published_at else None,
                "category": inferred_cat
            })
        return results
    except Exception as e:
        logger.debug(f"Database cache lookup skipped: {e}")
        return []


def save_articles_to_cache_db(db: Optional[Session], articles: List[Dict[str, Any]], category_tag: str):
    """Safely cache articles in PostgreSQL in one fast batch without hanging."""
    if not db:
        return
    try:
        urls = [a.get("url") for a in articles if a.get("url")]
        if not urls:
            return
            
        # Fast bulk check
        existing_urls = set(
            r[0] for r in db.query(LiveNewsCache.url).filter(LiveNewsCache.url.in_(urls)).all()
        )
        
        to_add = []
        for art in articles:
            url = art.get("url")
            if not url or url in existing_urls:
                continue
            
            pub_date = parse_datetime(art.get("publishedAt") or art.get("published_at"))
            detected_cat = detect_article_category(
                art.get("title", ""), 
                art.get("description"), 
                art.get("_category") or category_tag
            )
            
            cache_entry = LiveNewsCache(
                external_id=url,
                title=art.get("title", "").strip(),
                description=art.get("description"),
                content=art.get("content"),
                source_name=art.get("source", {}).get("name") if isinstance(art.get("source"), dict) else art.get("source_name", "Live Desk"),
                author=art.get("source", {}).get("name") if isinstance(art.get("source"), dict) else art.get("author", "Staff Reporter"),
                url=url,
                image_url=art.get("image") or art.get("image_url"),
                published_at=pub_date,
                category=detected_cat,
                fetched_at=datetime.utcnow()
            )
            to_add.append(cache_entry)
            
        if to_add:
            db.add_all(to_add)
            db.commit()
    except Exception as e:
        try:
            db.rollback()
        except Exception:
            pass
        logger.debug(f"Database caching skipped: {e}")


async def fetch_single_category(
    client: httpx.AsyncClient,
    api_key: str,
    category: str,
    lang: str = "en",
    country: str = "us",
    max_items: int = 10
) -> List[Dict[str, Any]]:
    """Fetch articles for a given category from GNews."""
    url = f"{GNEWS_BASE_URL}/top-headlines"
    params = {
        "apikey": api_key,
        "category": category,
        "lang": lang,
        "country": country,
        "max": max_items
    }
    try:
        r = await client.get(url, params=params)
        if r.status_code == 200:
            arts = r.json().get("articles", [])
            for a in arts:
                a["_category"] = category
            return arts
        elif r.status_code == 429:
            logger.warning(f"Rate limited on category '{category}'.")
        else:
            logger.warning(f"GNews response {r.status_code} for category '{category}': {r.text[:100]}")
    except Exception as e:
        logger.error(f"Error fetching category '{category}': {e}")
    return []


async def fetch_live_news(
    db: Optional[Session],
    category: Optional[str] = None,
    search: Optional[str] = None,
    country: str = "us",
    language: str = "en",
    limit: int = 100,
    page: int = 1
) -> Dict[str, Any]:
    """
    Fetch real-time live news articles from GNews with instant in-memory cache and DB backup.
    Aggregates diverse categories for a full rich newspaper portal experience.
    """
    cache_key = f"{category or 'all'}:{search or ''}:{country}:{language}:{limit}"
    now = time.time()
    
    # 1. Check in-memory cache
    if cache_key in _MEMORY_CACHE:
        cached_entry = _MEMORY_CACHE[cache_key]
        if now - cached_entry["timestamp"] < CACHE_TTL_SECONDS:
            articles = cached_entry["articles"]
            return {
                "status": "ok",
                "total_results": len(articles),
                "articles": articles[:limit],
                "category": category,
                "search": search,
                "is_cached": True,
                "source": "memory_cache",
                "message": None
            }

    api_key = settings.NEWS_API_KEY.strip() if settings.NEWS_API_KEY else ""
    
    # If no API key configured, check DB / memory
    if not api_key or api_key == "your_news_api_key_here":
        db_arts = get_cached_news_db(db, category=category, search=search, limit=limit)
        return {
            "status": "ok" if db_arts else "unavailable",
            "total_results": len(db_arts),
            "articles": db_arts,
            "category": category,
            "search": search,
            "is_cached": True,
            "source": "db_cache",
            "message": "Displaying cached news (API key not configured)." if db_arts else "Live news unavailable."
        }

    raw_articles: List[Dict[str, Any]] = []

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            if search and search.strip():
                # Search query
                url = f"{GNEWS_BASE_URL}/search"
                params = {
                    "apikey": api_key,
                    "q": search.strip(),
                    "lang": language,
                    "max": 10
                }
                r = await client.get(url, params=params)
                if r.status_code == 200:
                    raw_articles = r.json().get("articles", [])
                    for a in raw_articles:
                        a["_category"] = "search"
            elif category and category.lower() in VALID_CATEGORIES and category.lower() not in ("all", "general"):
                # Specific category query
                raw_articles = await fetch_single_category(client, api_key, category.lower(), lang=language, country=country, max_items=10)
            else:
                # Concurrent multi-category harvest with asyncio.gather
                tasks = [
                    fetch_single_category(client, api_key, "general", lang=language, country=country, max_items=10),
                    fetch_single_category(client, api_key, "technology", lang=language, country=country, max_items=10),
                    fetch_single_category(client, api_key, "business", lang=language, country=country, max_items=10),
                    fetch_single_category(client, api_key, "sports", lang=language, country=country, max_items=10),
                ]
                results = await asyncio.gather(*tasks, return_exceptions=True)
                for res in results:
                    if isinstance(res, list):
                        raw_articles.extend(res)

    except Exception as e:
        logger.error(f"Error calling GNews API: {e}")

    # Process and normalize fresh articles if fetched
    if raw_articles:
        normalized_articles = []
        seen_titles = set()
        for art in raw_articles:
            title = art.get("title", "").strip()
            if not title or title.lower() in seen_titles:
                continue
            seen_titles.add(title.lower())
            
            pub_dt = parse_datetime(art.get("publishedAt"))
            detected_category = detect_article_category(
                title, 
                art.get("description"), 
                art.get("_category") or category
            )
            
            normalized_articles.append({
                "title": title,
                "description": art.get("description"),
                "content": art.get("content") or art.get("description") or title,
                "source_name": art.get("source", {}).get("name") if isinstance(art.get("source"), dict) else "Live Desk",
                "author": art.get("source", {}).get("name") if isinstance(art.get("source"), dict) else "Staff Reporter",
                "url": art.get("url"),
                "image_url": art.get("image"),
                "published_at": pub_dt.isoformat() if pub_dt else datetime.utcnow().isoformat(),
                "category": detected_category
            })

        # Save to memory cache
        _MEMORY_CACHE[cache_key] = {
            "timestamp": now,
            "articles": normalized_articles
        }

        # Non-blocking DB cache attempt
        if db:
            try:
                save_articles_to_cache_db(db, raw_articles, category or "general")
            except Exception:
                pass

        return {
            "status": "ok",
            "total_results": len(normalized_articles),
            "articles": normalized_articles,
            "category": category,
            "search": search,
            "is_cached": False,
            "source": "gnews_live",
            "message": None
        }

    # If live fetch returned nothing or failed (e.g. rate limit), check memory cache or db
    if cache_key in _MEMORY_CACHE:
        return {
            "status": "ok",
            "total_results": len(_MEMORY_CACHE[cache_key]["articles"]),
            "articles": _MEMORY_CACHE[cache_key]["articles"][:limit],
            "category": category,
            "search": search,
            "is_cached": True,
            "source": "memory_cache_fallback",
            "message": "Displaying recent headlines."
        }

    db_arts = get_cached_news_db(db, category=category, search=search, limit=limit)
    return {
        "status": "ok" if db_arts else "unavailable",
        "total_results": len(db_arts),
        "articles": db_arts,
        "category": category,
        "search": search,
        "is_cached": True,
        "source": "db_cache_fallback",
        "message": "Displaying cached headlines." if db_arts else "Live headlines temporarily unavailable."
    }
