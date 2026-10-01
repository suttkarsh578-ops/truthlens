from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import subprocess
import os
import threading
from app.database.session import get_db
from app.models.model_metrics import ModelMetrics
from app.models.model_version import ModelVersion
from app.core.config import settings

router = APIRouter()

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    metrics = db.query(ModelMetrics).order_by(ModelMetrics.created_at.desc()).all()
    return metrics

@router.get("/info")
def get_info(db: Session = Depends(get_db)):
    version_info = db.query(ModelVersion).order_by(ModelVersion.created_at.desc()).first()
    return {
        "model_name": settings.MODEL_NAME,
        "model_path": settings.MODEL_PATH,
        "vectorizer_path": settings.VECTORIZER_PATH,
        "version_info": version_info
    }

def run_training_script():
    script_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "scripts", "train_model.py")
    subprocess.run(["python", script_path])

@router.post("/admin/retrain")
def retrain_model(x_admin_key: Optional[str] = Header(None)):
    if x_admin_key != settings.ADMIN_RETRAIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    
    thread = threading.Thread(target=run_training_script)
    thread.start()
    return {"status": "retraining_started"}
