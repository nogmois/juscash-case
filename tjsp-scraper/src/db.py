# src/db.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"options": "-c timezone=America/Sao_Paulo"}
)
SessionLocal = sessionmaker(bind=engine)

def ensure_schema():
    with engine.begin() as conn:
        conn.execute(text("""
            ALTER TABLE publications
            ADD COLUMN IF NOT EXISTS gross_value NUMERIC
        """))
        conn.execute(text("""
            ALTER TABLE publications
            ADD COLUMN IF NOT EXISTS net_value NUMERIC
        """))
