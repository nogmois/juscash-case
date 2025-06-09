// src/components/PublicationModal.jsx

import React from "react";
import { Modal, Descriptions } from "antd";

// formata número/Decimal como “R$ 1.234,56”
const formatCurrency = (value) => {
  if (value == null) return "--";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

export default function PublicationModal({ item, open, onCancel }) {
  // formata data de publicação
  // dentro do seu componente:
  const pubDate = (() => {
    if (!item.publicationDate) return "--";
    // item.publicationDate é algo como "2025-01-07"
    const [year, month, day] = item.publicationDate.split("-");
    return `${day}/${month}/${year}`;
  })();

  // transforma string de advogados em array
  const lawyers = item.lawyers
    ? item.lawyers.split(";").map((l) => l.trim())
    : [];

  return (
    <Modal
      title={`Publicação – ${item.processNumber}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1} size="small" layout="vertical">
        <Descriptions.Item label="Data de publicação no DJE">
          {pubDate}
        </Descriptions.Item>

        <Descriptions.Item label="Autor(es)">
          {item.authors || "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Réu">{item.defendant}</Descriptions.Item>

        <Descriptions.Item label="Advogado(s)">
          {lawyers.length > 0
            ? lawyers.map((law, i) => <div key={i}>{law}</div>)
            : "--"}
        </Descriptions.Item>

        <Descriptions.Item label="Valor principal bruto/líquido">
          {formatCurrency(item.grossValue ?? item.netValue)}
        </Descriptions.Item>

        <Descriptions.Item label="Valor dos juros moratórios">
          {formatCurrency(item.interestValue)}
        </Descriptions.Item>

        <Descriptions.Item label="Valor dos honorários advocatícios">
          {formatCurrency(item.attorneyFees)}
        </Descriptions.Item>

        <Descriptions.Item label="Conteúdo da Publicação">
          <div style={{ whiteSpace: "pre-wrap" }}>{item.content}</div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}
