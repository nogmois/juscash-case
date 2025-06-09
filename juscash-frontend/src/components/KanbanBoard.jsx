// src/components/KanbanBoard.jsx
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { message } from "antd";
import KanbanColumn from "./KanbanColumn";

const ORDER = ["new", "read", "sent_adv", "done"];

export default function KanbanBoard({
  publications,
  onStatusChange,
  isMobile,
}) {
  const columns = {
    new: {
      title: "Publicações Novas",
      items: publications.filter((p) => p.status === "new"),
    },
    read: {
      title: "Publicações Lidas",
      items: publications.filter((p) => p.status === "read"),
    },
    sent_adv: {
      title: "Enviadas para ADV",
      items: publications.filter((p) => p.status === "sent_adv"),
    },
    done: {
      title: "Concluídas",
      items: publications.filter((p) => p.status === "done"),
    },
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const from = source.droppableId;
    const to = destination.droppableId;
    const fromIdx = ORDER.indexOf(from);
    const toIdx = ORDER.indexOf(to);
    const isForward = toIdx === fromIdx + 1;
    const isReverseAllowed = from === "sent_adv" && to === "read";

    if (isForward || isReverseAllowed) {
      try {
        await onStatusChange(draggableId, to);
      } catch {
        /* erro tratado no parent */
      }
    } else {
      message.error("Movimento não permitido");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          overflowX: isMobile ? "auto" : "visible",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: isMobile ? "nowrap" : "wrap",
            justifyContent: isMobile ? "flex-start" : "space-between",
            alignItems: "flex-start",
          }}
        >
          {Object.entries(columns).map(([id, col]) => (
            <KanbanColumn
              key={id}
              columnId={id}
              column={col}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
