from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = ""
    MODEL_PATH: str = "app/ml/artifacts/model.pkl"
    VECTORIZER_PATH: str = "app/ml/artifacts/vectorizer.pkl"
    METRICS_PATH: str = "app/ml/artifacts/metrics.json"
    MODEL_NAME: str = "Logistic Regression"
    ADMIN_RETRAIN_KEY: str = "change_this_secret_key"
    NEWS_API_KEY: str = ""
    FRONTEND_URL: str = ""
    ENVIRONMENT: str = "development"
    
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "../backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
