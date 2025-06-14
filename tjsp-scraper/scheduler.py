# scheduler.py

import logging
from datetime import datetime
from dateutil import tz
from apscheduler.schedulers.blocking import BlockingScheduler

from src.scraper import scrape_page
from src.db       import ensure_schema, engine
from src.models   import Base

# configura logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

# 0) garante que a coluna gross_value/net_value existam
ensure_schema()

# cria quaisquer tabelas novas (não altera as existentes além das colunas acima)
Base.metadata.create_all(bind=engine)

# 1) dispara uma vez imediatamente  
logging.info("Executando scrape inicial antes de iniciar o cron…")
try:
    scrape_page()
except Exception as e:
    logging.error(f"Falha no scrape inicial: {e}")

sched = BlockingScheduler(timezone="America/Sao_Paulo")

# 2) agenda o cron diário (para 12:45h todo dia)
sched.add_job(
    scrape_page,
    trigger="cron",
    hour=12,
    minute=45,
    start_date=datetime(2025, 3, 17, tzinfo=tz.gettz("America/Sao_Paulo"))
)

# mostra o próximo run
next_run = sched.get_jobs()[0].trigger.get_next_fire_time(
    None, datetime.now(tz=tz.gettz("America/Sao_Paulo"))
)
logging.info(f"Próxima execução agendada para: {next_run}")

if __name__ == "__main__":
    sched.start()
