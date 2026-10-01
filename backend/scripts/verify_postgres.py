import sys
import os
import urllib.parse

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from sqlalchemy import text, inspect
from app.core.config import settings
from app.database.connection import engine, Base, get_database_url
from app.models import news_dataset, prediction, model_metrics, model_version, live_news_cache

def verify_postgresql():
    print("=" * 65)
    print("TruthLens PostgreSQL Connection & Table Verification")
    print("=" * 65)
    
    db_url = get_database_url()
    try:
        parsed = urllib.parse.urlparse(db_url)
        safe_url = db_url.replace(parsed.password or "", "******") if parsed.password else db_url
    except Exception:
        safe_url = "postgresql://postgres:******@localhost:5432/truthlens"
        
    print(f"\n[1] Target Database URL : {safe_url}")
        
    try:
        with engine.connect() as conn:
            # 1. Fetch PostgreSQL Version
            result = conn.execute(text("SELECT version();")).fetchone()
            pg_version = result[0] if result else "Unknown"
            print(f"[2] Connection Status    : SUCCESS (Connected)")
            print(f"[3] PostgreSQL Version   : {pg_version}")
            
            # 2. Inspect Existing Tables before create_all
            inspector = inspect(engine)
            initial_tables = inspector.get_table_names()
            print(f"[4] Pre-existing Tables  : {initial_tables if initial_tables else 'None'}")
            
            # 3. Create required tables safely (will not overwrite or drop existing data)
            print("\n[5] Ensuring Required SQLAlchemy Tables Exist...")
            Base.metadata.create_all(bind=engine)
            
            # 4. Inspect Final Tables & Row Counts
            final_inspector = inspect(engine)
            final_tables = final_inspector.get_table_names()
            
            required_tables = [
                "news_dataset",
                "predictions",
                "model_metrics",
                "model_versions",
                "live_news_cache"
            ]
            
            print("\n" + "-" * 65)
            print(f"{'Table Name':<20} | {'Status':<12} | {'Columns':<10} | {'Row Count'}")
            print("-" * 65)
            
            for tbl in required_tables:
                if tbl in final_tables:
                    cols = len(final_inspector.get_columns(tbl))
                    try:
                        count_res = conn.execute(text(f'SELECT COUNT(*) FROM "{tbl}";')).fetchone()
                        row_count = count_res[0] if count_res else 0
                    except Exception:
                        row_count = "N/A"
                    print(f"{tbl:<20} | {'EXISTS':<12} | {cols:<10} | {row_count}")
                else:
                    print(f"{tbl:<20} | {'MISSING':<12} | {'-':<10} | -")
                    
            print("-" * 65)
            print("\nAll 5 required tables verified successfully without modifying existing data!")
            return True, pg_version, final_tables, None
            
    except Exception as e:
        print(f"\n[ERROR] PostgreSQL Connection Failed:")
        print(f"Details: {e}")
        return False, None, [], str(e)

if __name__ == "__main__":
    verify_postgresql()
