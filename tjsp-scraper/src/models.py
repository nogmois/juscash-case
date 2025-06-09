# src/models.py


from sqlalchemy import (
    Column, Integer, String, Date, Text, Numeric, Enum,
    DateTime, func
)
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime


Base = declarative_base()

class Publication(Base):
    __tablename__ = "publications"

    id               = Column(Integer, primary_key=True, index=True)
    process_number   = Column(String, unique=True, nullable=False)
    publication_date = Column(Date)
    authors          = Column(Text)
    lawyers          = Column(Text)
    content          = Column(Text)
    gross_value      = Column(Numeric)
    net_value        = Column(Numeric)
    interest_value   = Column(Numeric)
    attorney_fees    = Column(Numeric)

    status = Column(
        Enum(
            "new",
            "read",
            "sent_adv",
            "done",
            name="pub_status"
        ),
        default="new",
        nullable=False
    )

    defendant        = Column(
        String,
        default="Instituto Nacional do Seguro Social - INSS",
        nullable=False
    )
    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,      # <- default Python
        server_default=func.now()     # <- ainda deixa o banco com server_default
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,      # <- default Python
        onupdate=datetime.utcnow,     # <- atualiza em Python
        server_default=func.now()
    )
