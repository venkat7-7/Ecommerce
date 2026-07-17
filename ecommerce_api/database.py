import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Load env file from parent directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/ecommerce_db")

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Automatically create the database if it doesn't exist
if DATABASE_URL.startswith("postgresql+psycopg2://"):
    try:
        # Extract connection details
        # Format: postgresql+psycopg2://user:password@host:port/dbname
        conn_str = DATABASE_URL.replace("postgresql+psycopg2://", "")
        if "/" in conn_str:
            auth_host, db_part = conn_str.rsplit("/", 1)
            db_name = db_part.split("?")[0]  # strip query parameters

            if "@" in auth_host:
                auth_part, host_part = auth_host.split("@", 1)
                user = auth_part.split(":")[0]
                password = auth_part.split(":")[1] if ":" in auth_part else ""
            else:
                host_part = auth_host
                user = "postgres"
                password = ""

            host = host_part.split(":")[0]
            port = int(host_part.split(":")[1]) if ":" in host_part else 5432

            # Connect to default database 'postgres' to create target db
            conn = psycopg2.connect(
                host=host,
                user=user,
                password=password,
                port=port,
                database="postgres"
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cursor = conn.cursor()
            cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}';")
            exists = cursor.fetchone()
            if not exists:
                cursor.execute(f"CREATE DATABASE \"{db_name}\";")
                print(f"Database '{db_name}' created.")
            cursor.close()
            conn.close()
    except Exception as e:
        print(f"Warning: Automatic database creation check failed: {e}")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
