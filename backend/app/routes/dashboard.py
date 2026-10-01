from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.dashboard import DashboardResponse
from app.services import analytics_service

router = APIRouter()

@router.get("", response_model=DashboardResponse)
@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return {
        "stats": analytics_service.get_dashboard_stats(db),
        "prediction_distribution": analytics_service.get_prediction_distribution(db),
        "activity_over_time": analytics_service.get_activity_over_time(db),
        "confidence_distribution": analytics_service.get_confidence_distribution(db),
        "model_performance": analytics_service.get_model_performance(db)
    }
