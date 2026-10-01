from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.analytics_service import get_dataset_stats

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return get_dataset_stats(db)
