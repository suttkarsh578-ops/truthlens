from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_name = Column(String(100), nullable=False)
    version = Column(String(20), nullable=True)
    vectorizer_name = Column(String(100), nullable=True)
    training_date = Column(DateTime, nullable=True)
    dataset_size = Column(Integer, nullable=True)
    model_path = Column(String(500), nullable=True)
    vectorizer_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=func.now())
