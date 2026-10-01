import sys
import os

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from app.database.connection import Base, engine
from app.core.logging import get_logger

logger = get_logger("truthlens.init_db")


def init_database():
    print("=" * 60)
    print("TruthLens Database Initialization")
    print("=" * 60)
    
    # Import all models to register them with Base
    from app.models import news_dataset, prediction, model_metrics, model_version
    
    print("\nCreating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("\nTables created successfully:")
        for table_name in Base.metadata.tables.keys():
            print(f"  ✓ {table_name}")
        print("\nDatabase initialization complete!")
    except Exception as e:
        print(f"\nERROR: Could not create tables: {e}")
        print("\nPlease check your DATABASE_URL in backend/.env")
        print("Make sure PostgreSQL is running and the database exists.")
        raise


if __name__ == "__main__":
    init_database()
