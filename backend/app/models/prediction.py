from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Index
from sqlalchemy.sql import func
from app.database.connection import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    headline = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    prediction = Column(String(10), nullable=False) # 'REAL' or 'FAKE'
    confidence = Column(Float, nullable=True)
    model_name = Column(String(100), nullable=False)
    processing_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        Index('ix_prediction_prediction', 'prediction'),
        Index('ix_prediction_created_at', 'created_at'),
    )
