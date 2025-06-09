# src/scraper.py


import math
import re
from io import BytesIO
from datetime import date
from typing import List

import requests
from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text
from urllib.parse import urljoin, urlparse, parse_qs

from src.db import SessionLocal, engine
from src.models import Publication, Base
from src.utils import parse_money, parse_date

from sqlalchemy.exc import IntegrityError

# Garante que as tabelas existam
Base.metadata.create_all(bind=engine)

def extract_money_after_label(label: str, text: str):
    pattern = (
        rf"R\$\s*([\d\.,]+)\s*[-\n]\s*"
        + label.replace("/", r"\s*/\s*")
    )
    m = re.search(pattern, text, re.IGNORECASE)
    return parse_money(m.group(1)) if m else None

def parse_publication_page_from_text(text: str) -> Publication | None:
    # (mantém seu parser atual)
    m_proc = re.search(r"Processo\s+([\d\.-]+)", text)
    proc = m_proc.group(1).strip() if m_proc else None

    m_raw = re.search(
        r"^Disponibilizaç[aã]o:\s*(.*?)\r?$",
        text,
        re.IGNORECASE | re.MULTILINE
    )
    if m_raw:
        raw = m_raw.group(1).strip()
        pub_date = parse_date(raw)
    else:
        pub_date = None

    m_author = re.search(r"-\s*([\w\s\.\-]+?)\s*-\s*Vistos", text)
    author = m_author.group(1).strip() if m_author else None

    m_lawyers = re.findall(r"([A-Za-zÁ-ÿ\.\s]+\(OAB\s*\d+/\w+\))", text)
    lawyers = "; ".join(l.strip() for l in m_lawyers) if m_lawyers else None

    principal = extract_money_after_label("principal bruto/líquido", text)
    interest  = extract_money_after_label(r"juros morat[óo]rios?", text)
    fees      = extract_money_after_label(r"honor[aá]rios advocat[íi]cios", text)

    if not proc:
        return None

    return Publication(
        process_number   = proc,
        publication_date = pub_date,
        authors          = author,
        lawyers          = lawyers,
        content          = text,
        gross_value      = principal,
        net_value        = principal,
        interest_value   = interest,
        attorney_fees    = fees,
        defendant        = "Instituto Nacional do Seguro Social - INSS",
        status           = "new"
    )

def construir_url_pdf(consulta_url: str) -> str:
    parsed = urlparse(consulta_url)
    params = parse_qs(parsed.query)
    return (
        "https://dje.tjsp.jus.br/cdje/getPaginaDoDiario.do"
        f"?cdVolume={params['cdVolume'][0]}"
        f"&nuDiario={params['nuDiario'][0]}"
        f"&cdCaderno={params['cdCaderno'][0]}"
        f"&nuSeqpagina={params['nuSeqpagina'][0]}"
    )


def save_batch(db, batch):
    try:
        db.bulk_save_objects(batch)
        db.commit()
        db.expunge_all()
        print(f"[BATCH SAVED] {len(batch)} publicações")
    except IntegrityError as e:
        db.rollback()
        print(f"[ERROR BATCH] falha ao salvar lote: {e}")


def search_and_scrape(
    start_date: str,
    end_date: str,
    caderno: int,
    termos: List[str],
    batch_size: int,
):
    base_url = "https://dje.tjsp.jus.br"
    sess = requests.Session()

    # 1) preparar payload inicial
    resp = sess.get(f"{base_url}/cdje/index.do")
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    form = soup.find("form", {"name": "consultaAvancadaForm"})
    payload = {
        inp["name"]: inp.get("value", "")
        for inp in form.find_all("input", {"name": True})
    }
    for sel in form.find_all("select"):
        name = sel.get("name")
        if name:
            opt = sel.find("option", selected=True)
            payload[name] = opt.get("value", "") if opt else ""

    payload.update({
        "dadosConsulta.dtInicio":      start_date,
        "dadosConsulta.dtFim":         end_date,
        "dadosConsulta.cdCaderno":     str(caderno),
        "dadosConsulta.pesquisaLivre": f"{termos[0]} E {termos[1]}",
    })

    # 2) faz a busca da página 1
    resp = sess.post(f"{base_url}/cdje/consultaAvancada.do", data=payload)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    # 3) extrai total de resultados e calcula total_pages
    m_total = re.search(r"Resultados\s+\d+\s+a\s+\d+\s+de\s+(\d+)", soup.text)
    total = int(m_total.group(1)) if m_total else 0
    total_pages = math.ceil(total / 10)
    print(f"[INFO] Total de resultados: {total}, páginas estimadas: {total_pages}")

    # 4) percorre cada página de 1 até total_pages via AJAX
    all_links = []
    for page in range(1, total_pages + 1):
        if page == 1:
            current_soup = soup
        else:
            resp = sess.post(
                f"{base_url}/cdje/trocaDePagina.do",
                data={"pagina": str(page)}
            )
            resp.raise_for_status()
            current_soup = BeautifulSoup(resp.text, "html.parser")
            print(f"[INFO] Processando página {page}/{total_pages}")

        # 5) coleta todos os links de popup
        for a in current_soup.find_all("a", onclick=True):
            onclick = a["onclick"]
            m = re.search(
                r"""popup\(\s*['"](/cdje/consultaSimples\.do\?[^'"]+)['"]\s*\)""",
                onclick
            )
            if m:
                url = urljoin(base_url, m.group(1))
                if url not in all_links:
                    all_links.append(url)

    print(f"[INFO] Total de links coletados: {len(all_links)}")

    # 6) faz download de cada PDF e persiste no banco em lotes
    db = SessionLocal()
    batch: List[Publication] = []

    for idx, url in enumerate(all_links, start=1):
        try:
            print(f"[{idx}/{len(all_links)}] {url}")
            pdf_url = construir_url_pdf(url)
            pdf_resp = sess.get(pdf_url)
            pdf_resp.raise_for_status()
            text = extract_text(BytesIO(pdf_resp.content))

            pub = parse_publication_page_from_text(text)
            if not pub:
                print("[WARN] parser não extraiu publicação.")
                continue

            exists = db.query(Publication.process_number)\
                       .filter_by(process_number=pub.process_number)\
                       .first()
            if exists:
                print(f"[SKIP] já existe: {pub.process_number}")
                continue

            batch.append(pub)

            if len(batch) >= batch_size:
                save_batch(db, batch)
                batch = []

        except Exception as e:
            print(f"[ERRO] ao processar {url}: {e}")

    # salva o que sobrou no batch final
    if batch:
        save_batch(db, batch)

    db.close()
    print("\n[DONE] Raspagem finalizada.\n")





def scrape_page():
    hoje = date.today().strftime("%d/%m/%Y")
    search_and_scrape(
        start_date="17/03/2025",
        end_date="27/03/2025",
        caderno=12,
        termos=["RPV", "pagamento pelo INSS"],
        batch_size=50,  # agora salva em lotes de 50
    )
