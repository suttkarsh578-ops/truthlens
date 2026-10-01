import os
import sys
import socket

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, ".env"))

print("=== STEP 1: Check .env Configuration ===")
raw_url = os.getenv("DATABASE_URL", "")
url_exists = bool(raw_url)
print(f"DATABASE_URL configured: {url_exists}")

# Check scheme and database name without exposing password
is_postgres = "postgresql" in raw_url or "postgres" in raw_url
has_truthlens = raw_url.endswith("/truthlens") or "/truthlens?" in raw_url or "/truthlens" in raw_url
print(f"Points to PostgreSQL scheme: {is_postgres}")
print(f"Target Database is 'truthlens': {has_truthlens}")

import re
db_host = "localhost"
db_port = 5432
if raw_url:
    host_match = re.search(r"@([^@/:]+)(?::(\d+))?", raw_url)
    if host_match:
        db_host = host_match.group(1)
        if host_match.group(2):
            db_port = int(host_match.group(2))

print(f"\n=== STEP 2 & 4: Socket Reachability on {db_host}:{db_port} ===")
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.settimeout(3.0)
try:
    sock_result = sock.connect_ex((db_host, db_port))
    if sock_result == 0:
        print(f"TCP Port {db_port} on {db_host}: OPEN and REACHABLE")
    else:
        print(f"TCP Port {db_port} connect failed with code: {sock_result}")
except Exception as se:
    print(f"Socket connection error: {se}")
finally:
    sock.close()

print("\n=== STEP 2, 3, 5, 6, 7 & 8: SQLAlchemy & Live Database Query ===")
try:
    from app.database.connection import engine
    from sqlalchemy import text, inspect

    with engine.connect() as conn:
        # Step 2 & 3: SELECT current_database(), current_user, version()
        row = conn.execute(text("SELECT current_database(), current_user, version();")).fetchone()
        current_db = row[0] if row else "Unknown"
        current_user = row[1] if row else "Unknown"
        version_str = row[2] if row else "Unknown"
        
        print(f"Active Connection Query Result:")
        print(f"  current_database(): {current_db}")
        print(f"  current_user      : {current_user}")
        print(f"  version()         : {version_str}")
        
        # Step 5 & 6: Query information_schema.tables
        schema_query = text(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
        )
        tables_in_public = [r[0] for r in conn.execute(schema_query).fetchall()]
        print(f"\nTables found in 'public' schema via information_schema.tables:")
        for t in tables_in_public:
            print(f"  - {t}")
            
        required_tables = [
            "news_dataset",
            "predictions",
            "model_metrics",
            "model_versions",
            "live_news_cache"
        ]
        
        print("\nRequired Tables Verification:")
        all_tables_exist = True
        for req in required_tables:
            exists = req in tables_in_public
            status = "EXISTS" if exists else "MISSING"
            if not exists:
                all_tables_exist = False
            print(f"  - {req}: {status}")
            
        print("\nSQLAlchemy query execution test:")
        test_scalar = conn.execute(text("SELECT 1;")).scalar()
        print(f"  SELECT 1 scalar test: {test_scalar} (WORKING)")
        
except Exception as e:
    print(f"Database Query Exception: {e}")

print("\n=== STEP 9: FastAPI Backend Health Endpoint ===")
try:
    import httpx
    api_url = os.getenv("VITE_API_BASE_URL") or os.getenv("API_BASE_URL") or "http://127.0.0.1:8000/api"
    health_url = f"{api_url.rstrip('/')}/health"
    resp = httpx.get(health_url, follow_redirects=True, timeout=5.0)
    print(f"FastAPI /api/health HTTP Status: {resp.status_code}")
    print(f"FastAPI /api/health JSON Response: {resp.json()}")
except Exception as he:
    print(f"FastAPI health check failed: {he}")
