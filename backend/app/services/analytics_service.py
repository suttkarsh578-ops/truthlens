from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, String
from datetime import datetime, timedelta
from app.models.prediction import Prediction
from app.models.model_metrics import ModelMetrics
from app.models.news_dataset import NewsDataset


def get_dashboard_stats(db: Session) -> dict:
    total = db.query(Prediction).count()
    real = db.query(Prediction).filter(Prediction.prediction == 'REAL').count()
    fake = db.query(Prediction).filter(Prediction.prediction == 'FAKE').count()
    avg_conf = db.query(func.avg(Prediction.confidence)).scalar()

    return {
        "total_analyses": total,
        "real_count": real,
        "fake_count": fake,
        "avg_confidence": round(float(avg_conf), 2) if avg_conf is not None else None,
        "real_percentage": round(real / total * 100, 1) if total > 0 else 0.0,
        "fake_percentage": round(fake / total * 100, 1) if total > 0 else 0.0,
    }


def get_prediction_distribution(db: Session) -> list:
    counts = db.query(
        Prediction.prediction,
        func.count(Prediction.id)
    ).group_by(Prediction.prediction).all()
    return [{"label": p, "value": float(c)} for p, c in counts]


def get_activity_over_time(db: Session, days: int = 30) -> list:
    cutoff = datetime.utcnow() - timedelta(days=days)

    results = db.query(
        cast(Prediction.created_at, Date).label('date'),
        Prediction.prediction,
        func.count(Prediction.id).label('count')
    ).filter(
        Prediction.created_at >= cutoff
    ).group_by(
        cast(Prediction.created_at, Date),
        Prediction.prediction
    ).order_by(
        cast(Prediction.created_at, Date)
    ).all()

    data_by_date: dict = {}
    for r in results:
        # r.date can be a date object or string depending on DB driver
        if hasattr(r.date, 'strftime'):
            d = r.date.strftime('%Y-%m-%d')
        else:
            d = str(r.date)
        if d not in data_by_date:
            data_by_date[d] = {"date": d, "count": 0, "real_count": 0, "fake_count": 0}
        data_by_date[d]["count"] += r.count
        if r.prediction == 'REAL':
            data_by_date[d]["real_count"] += r.count
        else:
            data_by_date[d]["fake_count"] += r.count

    return list(data_by_date.values())


def get_confidence_distribution(db: Session) -> list:
    """Return confidence distribution in 10 equal buckets (0-10%, 10-20%, ..., 90-100%)."""
    distribution = []
    for i in range(10):
        low = i * 10.0
        high = (i + 1) * 10.0
        label = f"{int(low)}-{int(high)}%"
        if i == 9:
            # Last bucket is inclusive of 100
            count = db.query(Prediction).filter(
                Prediction.confidence >= low,
                Prediction.confidence <= high
            ).count()
        else:
            count = db.query(Prediction).filter(
                Prediction.confidence >= low,
                Prediction.confidence < high
            ).count()
        distribution.append({"range": label, "count": count})
    return distribution


def get_model_performance(db: Session) -> list:
    """Return the latest metrics for each model."""
    # Subquery to get max id per model_name
    subq = db.query(
        func.max(ModelMetrics.id).label('max_id')
    ).group_by(ModelMetrics.model_name).subquery()

    metrics = db.query(ModelMetrics).filter(
        ModelMetrics.id.in_(subq)
    ).all()

    return [
        {
            "model_name": m.model_name,
            "accuracy": round(m.accuracy, 4) if m.accuracy is not None else None,
            "precision_score": round(m.precision_score, 4) if m.precision_score is not None else None,
            "recall_score": round(m.recall_score, 4) if m.recall_score is not None else None,
            "f1_score": round(m.f1_score, 4) if m.f1_score is not None else None,
        }
        for m in metrics
    ]


def get_dataset_stats(db: Session) -> dict:
    total = db.query(NewsDataset).count()
    real = db.query(NewsDataset).filter(NewsDataset.label == 0).count()
    fake = db.query(NewsDataset).filter(NewsDataset.label == 1).count()

    sources = db.query(
        NewsDataset.source_dataset,
        func.count(NewsDataset.id)
    ).group_by(NewsDataset.source_dataset).all()

    return {
        "total": total,
        "real_count": real,
        "fake_count": fake,
        "source_distribution": {
            (s[0] if s[0] else "Unknown"): s[1]
            for s in sources
        }
    }
