from sqlalchemy import Column, Integer, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.database.connection import Base

class NewsDataset(Base):
    __tablename__ = "news_dataset"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(Text, nullable=True)
    text = Column(Text, nullable=True)
    subject = Column(String(100), nullable=True)
    date = Column(String(100), nullable=True)
    label = Column(Integer, nullable=False) # 0=REAL, 1=FAKE
    source_dataset = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        Index('ix_news_dataset_label', 'label'),
        Index('ix_news_dataset_source', 'source_dataset'),
    )
