from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
import logging

from app.core.config import settings
from app.core.logging import get_logger
from app.database.connection import Base, engine
from app.routes import health, prediction, history, dashboard, model, dataset, live_news

logger = get_logger("truthlens.startup")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting TruthLens API...")
    
    # Check Database Connection & Initialize Tables
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            logger.info("Database connection successfully established.")
            
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Database connection/initialization error: {e}")
        
    yield
    logger.info("Shutting down TruthLens API.")


app = FastAPI(
    title="TruthLens API",
    description="Fake News Detection using NLP and Machine Learning",
    version="1.0.0",
    lifespan=lifespan,
    redirect_slashes=False  # Avoids 307 Temporary Redirect issues on trailing slashes
)

# CORS configuration - dynamically read from FRONTEND_URL environment variable
origins = [origin.strip() for origin in settings.FRONTEND_URL.split(",") if origin.strip()] if settings.FRONTEND_URL else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."}
    )


# Mount routers
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(prediction.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(model.router, prefix="/api/model", tags=["Model"])
app.include_router(dataset.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(live_news.router, prefix="/api/live-news", tags=["Live News"])


@app.get("/", tags=["Root"])
def read_root():
    return {
        "status": "TruthLens API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }