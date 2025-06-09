# scheduler.py

import logging
from datetime import datetime
from dateutil import tz
from apscheduler.schedulers.blocking import BlockingScheduler
from src.scraper import scrape_page

# configura logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s"
)

sched = BlockingScheduler(timezone="America/Sao_Paulo")

# agenda o cron diário
job = sched.add_job(
    scrape_page,
    trigger="cron",
    hour=12,
    minute=45,
    start_date=datetime(2025, 3, 17, tzinfo=tz.gettz("America/Sao_Paulo"))
)

# calcula o próximo run
next_run = job.trigger.get_next_fire_time(None, datetime.now(tz=tz.gettz("America/Sao_Paulo")))
print(f"Próxima execução agendada para: {next_run}")

if __name__ == "__main__":
    sched.start()
