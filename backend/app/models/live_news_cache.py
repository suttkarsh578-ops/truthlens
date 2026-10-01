from sqlalchemy import Column, Integer, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.database.connection import Base

class LiveNewsCache(Base):
    __tablename__ = "live_news_cache"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(String(255), nullable=True, index=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    source_name = Column(String(255), nullable=True)
    author = Column(String(255), nullable=True)
    url = Column(Text, nullable=True, unique=True, index=True)
    image_url = Column(Text, nullable=True)
    published_at = Column(DateTime, nullable=True, index=True)
    category = Column(String(100), nullable=True, index=True)
    fetched_at = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        Index('ix_live_news_published_at', 'published_at'),
        Index('ix_live_news_category', 'category'),
    )
