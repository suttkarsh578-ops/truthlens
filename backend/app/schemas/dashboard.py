from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class DashboardStats(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_analyses: int
    real_count: int
    fake_count: int
    avg_confidence: Optional[float] = None
    real_percentage: float
    fake_percentage: float


class ChartDataPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    label: str
    value: float


class TimeSeriesPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: str
    count: int
    real_count: int
    fake_count: int


class ConfidenceDistribution(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    range: str
    count: int


class ModelPerformance(BaseModel):
    # protected_namespaces=() se 'model_name' wali Pydantic warning fix ho jayegi
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    model_name: str
    accuracy: Optional[float] = None
    precision_score: Optional[float] = None
    recall_score: Optional[float] = None
    f1_score: Optional[float] = None


class DashboardResponse(BaseModel):
    # protected_namespaces=() se 'model_performance' wali warning fix ho jayegi
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    stats: DashboardStats
    prediction_distribution: List[ChartDataPoint]
    activity_over_time: List[TimeSeriesPoint]
    confidence_distribution: List[ConfidenceDistribution]
    model_performance: List[ModelPerformance]