// src/pages/Kanban.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Layout, Input, DatePicker, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import publicationService from "@/services/publicationService";

const { Content } = Layout;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function Kanban() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [publications, setPublications] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const isMobile = useIsMobile();

  const fetchPublications = useCallback(async () => {
    try {
      const params = {};
      if (search.trim()) params.query = search.trim();
      if (dateRange[0]) params.from = dayjs(dateRange[0]).format("YYYY-MM-DD");
      if (dateRange[1]) params.to = dayjs(dateRange[1]).format("YYYY-MM-DD");

      const data = await publicationService.fetch(params);
      setPublications(data);
    } catch {
      message.error("Falha ao buscar publicações. Tente novamente.");
    }
  }, [search, dateRange]);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      fetchPublications();
    }, 400);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [search, dateRange, fetchPublications]);

  async function handleStatusChange(id, newStatus) {
    try {
      await publicationService.updateStatus(id, newStatus);
      setPublications((prev) =>
        prev.map((p) =>
          String(p.id) === String(id) ? { ...p, status: newStatus } : p
        )
      );
    } catch {
      message.error("Não foi possível atualizar o status. Tente de novo.");
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <Navbar />
      <Content style={{ padding: "48px 16px 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: isMobile ? 16 : 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#072854",
                fontSize: "34px", // aumento aqui
                lineHeight: 1.2,
              }}
            >
              Publicações
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 16,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "100%" : 300,
                }}
              >
                <label style={{ marginBottom: 4, color: "#072854" }}>
                  Pesquisar
                </label>
                <Input
                  placeholder="Número, autor, réu ou advogado"
                  value={search}
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <label style={{ marginBottom: 4, color: "#072854" }}>
                  Data do diário
                </label>
                <DatePicker.RangePicker
                  onChange={(val) => setDateRange(val || [])}
                  value={dateRange}
                  disabledDate={(current) => current > dayjs().endOf("day")}
                  style={{ width: isMobile ? "100%" : "auto" }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <KanbanBoard
              publications={publications}
              onStatusChange={handleStatusChange}
              isMobile={isMobile}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
