// src/components/KanbanColumn.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "antd";
import PublicationCard from "./PublicationCard";

export default function KanbanColumn({ columnId, column, isMobile }) {
  const [visibleCount, setVisibleCount] = useState(30);

  // Sempre que a lista de itens muda, volta para 30
  useEffect(() => {
    setVisibleCount(30);
  }, [column.items.length]);

  // Função que expande a quantidade visível
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 30, column.items.length));
  }, [column.items.length]);

  // Handler direto de scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // quando faltar 50px para o fim, carrega mais
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMore();
    }
  };

  return (
    <Card
      title={`${column.title} (${column.items.length})`}
      bodyStyle={{ padding: 8 }}
      style={{
        flex: isMobile ? "0 0 320px" : "1",
        minWidth: isMobile ? "320px" : "auto",
        maxHeight: "80vh",
        overflow: "hidden", // importante: o scroll fica aqui dentro
        backgroundColor: "#f9f9f9",
      }}
    >
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            onScroll={handleScroll}
            style={{
              minHeight: 100,
              maxHeight: "80vh", // garante que esse div role
              overflowY: "auto",
            }}
          >
            {column.items.slice(0, visibleCount).map((pub, idx) => (
              <PublicationCard key={pub.id} item={pub} index={idx} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
}
