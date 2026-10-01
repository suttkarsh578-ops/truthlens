import os
import sys
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL", "")
print("DATABASE_URL found:", bool(db_url))

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database.connection import engine, Base
    from app.models import news_dataset, prediction, model_metrics, model_version, live_news_cache
    from sqlalchemy import text, inspect

    with engine.connect() as connection:
        # Check PG version
        version_result = connection.execute(text("SELECT version();")).fetchone()
        pg_version = version_result[0] if version_result else "Unknown"
        print("\n==========================================")
        print("DATABASE CONNECTION STATUS: SUCCESS")
        print("==========================================")
        print(f"PostgreSQL Version: {pg_version}")
        
        # Check initial tables
        inspector = inspect(engine)
        initial_tables = inspector.get_table_names()
        print(f"\nInitial tables in database: {initial_tables}")
        
        # Ensure all 5 required tables are created
        print("\nEnsuring all required SQLAlchemy tables exist...")
        Base.metadata.create_all(bind=engine)
        
        # Check final tables
        final_inspector = inspect(engine)
        final_tables = final_inspector.get_table_names()
        print("\nFinal verified tables:")
        for t in ["news_dataset", "predictions", "model_metrics", "model_versions", "live_news_cache"]:
            exists = t in final_tables
            if exists:
                count_res = connection.execute(text(f'SELECT COUNT(*) FROM "{t}";')).fetchone()
                row_count = count_res[0] if count_res else 0
                print(f"  [OK] {t} (Status: PRESENT, Records: {row_count})")
            else:
                print(f"  [MISSING] {t} (Status: NOT FOUND)")
                
except Exception as e:
    print("\n==========================================")
    print("DATABASE CONNECTION STATUS: FAILED")
    print("==========================================")
    print(f"Error Details: {e}")
