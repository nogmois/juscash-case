# src/utils.py
from decimal import Decimal
from datetime import date
from typing import Optional

# mapeamento de meses em português para número
_PT_MONTHS = {
    'janeiro':   1,  'fevereiro':  2,  'março':   3,
    'abril':     4,  'maio':       5,  'junho':   6,
    'julho':     7,  'agosto':     8,  'setembro': 9,
    'outubro':  10,  'novembro':  11,  'dezembro': 12,
}

def parse_money(text: str) -> Optional[Decimal]:
    """
    Converte string “R$ 1.234,56” em Decimal(1234.56).
    Se text for vazio ou inválido, retorna None.
    """
    if not text:
        return None
    num = text.replace("R$", "").replace(".", "").replace(",", ".").strip()
    try:
        return Decimal(num)
    except:
        return None

def parse_date(text: str) -> Optional[date]:
    """
    Converte string “7 de janeiro de 2025” em date(2025, 1, 7).
    Se formatar falhar, retorna None.
    """
    if not text:
        return None

    # pode vir com dia da semana: "terça-feira, 7 de janeiro de 2025"
    if ',' in text:
        text = text.split(',', 1)[1].strip()

    parts = text.split()
    # espera ['7', 'de', 'janeiro', 'de', '2025']
    try:
        day   = int(parts[0])
        month = _PT_MONTHS[parts[2].lower()]
        year  = int(parts[4])
        return date(year, month, day)
    except Exception:
        return None
