"""
Database Configuration & Session Management for MySQL with SQLAlchemy
Lost and Found College DBMS Project
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# MySQL Database URL format:
# mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>
# Default fallback for local testing:
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/lost_and_found"
)

# SQLite fallback support if running in an environment without an active MySQL daemon
# while preserving full MySQL dialect compatibility in SQL DDL and models
IS_SQLITE = DATABASE_URL.startswith("sqlite")

if IS_SQLITE:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency generator that yields an active database session and closes on completion."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
