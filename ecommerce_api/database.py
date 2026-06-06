import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pymysql

# Load env file from parent directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost:3306/ecommerce_db")

# Automatically create the database if it doesn't exist
if DATABASE_URL.startswith("mysql+pymysql://"):
    try:
        # Extract connection details
        # Format: mysql+pymysql://user:password@host:port/dbname
        conn_str = DATABASE_URL.replace("mysql+pymysql://", "")
        if "/" in conn_str:
            auth_host, db_part = conn_str.rsplit("/", 1)
            db_name = db_part.split("?")[0]  # strip query parameters

            if "@" in auth_host:
                auth_part, host_part = auth_host.split("@", 1)
                user = auth_part.split(":")[0]
                password = auth_part.split(":")[1] if ":" in auth_part else ""
            else:
                host_part = auth_host
                user = "root"
                password = ""

            host = host_part.split(":")[0]
            port = int(host_part.split(":")[1]) if ":" in host_part else 3306

            # Connect without specifying database name to create it
            conn = pymysql.connect(
                host=host,
                user=user,
                password=password,
                port=port
            )
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            conn.commit()
            cursor.close()
            conn.close()
    except Exception as e:
        print(f"Warning: Automatic database creation check failed (verify your MySQL credentials): {e}")

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
