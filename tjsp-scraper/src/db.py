# src/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # carrega DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

# adiciona o parâmetro de timezone na conexão
engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={
        # instrui o Postgres a usar America/Sao_Paulo como timezone da sessão
        "options": "-c timezone=America/Sao_Paulo"
    }
)

SessionLocal = sessionmaker(bind=engine)
