from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.prediction import Prediction
from app.schemas.history import HistoryResponse, HistoryItem
import math

router = APIRouter()

@router.get("", response_model=HistoryResponse)
@router.get("/", response_model=HistoryResponse)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str = "",
    filter: str = "all",
    sort: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Prediction)
    
    if filter in ["REAL", "FAKE", "real", "fake"]:
        query = query.filter(Prediction.prediction == filter.upper())
        
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Prediction.headline.ilike(search_term),
                Prediction.content.ilike(search_term)
            )
        )
        
    if sort == "asc":
        query = query.order_by(Prediction.created_at.asc())
    else:
        query = query.order_by(Prediction.created_at.desc())
        
    total = query.count()
    pages = math.ceil(total / page_size) if total > 0 else 0
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages
    }

@router.get("/{id}", response_model=HistoryItem)
def get_history_item(id: int, db: Session = Depends(get_db)):
    item = db.query(Prediction).filter(Prediction.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return item
