// src/components/PublicationCard.jsx

import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card, Space } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";
import PublicationModal from "./PublicationModal";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("pt-br", {
  relativeTime: {
    future: "em %s",
    past: "%s",
    s: "agora",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1a",
    yy: "%da",
  },
});

export default function PublicationCard({ item, index }) {
  const [open, setOpen] = useState(false);

  const lastStamp = item.updatedAt || item.createdAt;
  const lastInSP = dayjs.utc(lastStamp).tz("America/Sao_Paulo");
  const relative = lastInSP.fromNow(true);
  const formattedDate = lastInSP.format("DD/MM/YYYY");

  return (
    <>
      <Draggable draggableId={String(item.id)} index={index}>
        {(prov) => (
          <div
            ref={prov.innerRef}
            {...prov.draggableProps}
            {...prov.dragHandleProps}
            style={{ marginBottom: 8, ...prov.draggableProps.style }}
          >
            <Card
              size="small"
              onClick={() => setOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <strong>{item.processNumber}</strong>

                {/* agora relative e date lado a lado, com wrap e alinhamento à direita */}
                <Space
                  size="middle"
                  wrap
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <span>
                    <ClockCircleOutlined /> {relative}
                  </span>
                  <span>
                    <CalendarOutlined /> {formattedDate}
                  </span>
                </Space>
              </Space>
            </Card>
          </div>
        )}
      </Draggable>

      <PublicationModal
        item={item}
        open={open}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
