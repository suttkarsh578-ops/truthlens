from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from app.core.config import settings


import urllib.parse
import re

def get_database_url() -> str:
    """Ensure the DATABASE_URL uses the psycopg2 driver explicitly and safely handles special characters in passwords."""
    raw_url = settings.DATABASE_URL
    if not raw_url:
        return raw_url

    # Normalize scheme
    if raw_url.startswith("postgresql://"):
        raw_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    elif raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)

    # Safely handle special characters like '@' in password
    # Pattern: scheme://user:password@host:port/dbname
    pattern = r"^(?P<scheme>[^:]+://)(?P<user>[^:]+):(?P<password>.+)@(?P<host>[^@/:]+)(?::(?P<port>\d+))?/(?P<dbname>.+)$"
    match = re.match(pattern, raw_url)
    if match:
        scheme = match.group("scheme")
        user = match.group("user")
        pwd = match.group("password")
        host = match.group("host")
        port = f":{match.group('port')}" if match.group("port") else ""
        dbname = match.group("dbname")
        
        # URL-encode password if it contains unescaped characters like @
        encoded_pwd = urllib.parse.quote(urllib.parse.unquote(pwd))
        return f"{scheme}{user}:{encoded_pwd}@{host}{port}/{dbname}"

    return raw_url


database_url = get_database_url()

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 5},
)

Base = declarative_base()
