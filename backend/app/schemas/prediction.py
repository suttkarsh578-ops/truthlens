from pydantic import BaseModel, ConfigDict, model_validator
from typing import Optional, Dict, Any, List


class PredictRequest(BaseModel):
    headline: Optional[str] = None
    content: Optional[str] = None

    @model_validator(mode='after')
    def check_at_least_one_field(self) -> 'PredictRequest':
        headline = (self.headline or '').strip()
        content = (self.content or '').strip()
        if not headline and not content:
            raise ValueError('At least one of headline or content must be provided.')
        combined = headline + content
        if len(combined) > 50000:
            raise ValueError('Maximum combined length is 50000 characters.')
        return self


class TextStatistics(BaseModel):
    characters: int
    words: int
    sentences: int
    processed_length: int


class PredictResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True, 
        extra='allow', 
        protected_namespaces=()
    )

    prediction: str
    confidence: Optional[float] = None
    model_name: str
    model_version: Optional[str] = "1.0"
    processing_time_ms: Optional[int] = None
    headline: Optional[str] = None
    content: Optional[str] = None
    text_statistics: Optional[TextStatistics] = None
    model_probabilities: Optional[Dict[str, float]] = None
    multi_model_analysis: Optional[List[Any]] = None
    top_keywords: Optional[List[Any]] = None
    credibility_indicators: Optional[Dict[str, float]] = None
    disclaimer: str
    word_count: int
    char_count: int
    processed_length: int