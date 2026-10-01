from sqlalchemy.orm import Session
from app.models.news_dataset import NewsDataset
from app.services.analytics_service import get_dataset_stats

def get_dataset_sample(db: Session, limit: int = 10) -> list:
    samples = db.query(NewsDataset).limit(limit).all()
    return [{
        "id": s.id,
        "title": s.title,
        "text": s.text[:200] + "..." if s.text else "",
        "subject": s.subject,
        "date": s.date,
        "label": s.label,
        "source": s.source_dataset
    } for s in samples]
