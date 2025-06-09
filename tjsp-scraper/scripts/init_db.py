# scripts/init_db.py
import os
import sys

# adiciona o diretório raiz do projeto ao PYTHONPATH para localizar o pacote src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv

# Carrega variáveis de ambiente de .env
load_dotenv()

from src.db import engine
from src.models import Base

def init_db():
    """
    Cria todas as tabelas definidas nos seus modelos SQLAlchemy.
    """
    print("Criando tabelas no banco...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso.")

if __name__ == "__main__":
    init_db()
