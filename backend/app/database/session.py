from sqlalchemy.orm import sessionmaker
from app.database.connection import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        try:
            db.close()
        except Exception:
            pass

def get_optional_db():
    try:
        db = SessionLocal()
        try:
            yield db
        finally:
            try:
                db.close()
            except Exception:
                pass
    except Exception:
        yield None

