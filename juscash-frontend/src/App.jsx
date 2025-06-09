//src/App.jsx

import React from "react";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <AppRoutes />
    </ConfigProvider>
  );
}
