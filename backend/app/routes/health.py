from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
import os
from app.database.session import get_db
from app.core.config import settings

router = APIRouter()

@router.get("")
@router.get("/")
def health_check(db: Session = Depends(get_db)):
    status = "ok"
    
    # Check DB
    db_status = "ok"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = "error"
        status = "degraded"
        
    # Check artifacts
    model_exists = os.path.exists(settings.MODEL_PATH)
    vectorizer_exists = os.path.exists(settings.VECTORIZER_PATH)
    
    if not model_exists or not vectorizer_exists:
        status = "degraded"

    return {
        "status": status,
        "database": db_status,
        "model": "ok" if model_exists else "missing",
        "vectorizer": "ok" if vectorizer_exists else "missing",
        "timestamp": datetime.utcnow().isoformat()
    }
