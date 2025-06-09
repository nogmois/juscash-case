// src/components/Navbar.jsx

import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-novo.png";

const { Header } = Layout;

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function Navbar() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  function handleLogout() {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "0 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        height: 64,
      }}
    >
      <img
        src={logo}
        alt="JusCash"
        style={{
          height: 32,
          objectFit: "contain",
        }}
      />

      <Button
        type="text"
        icon={<LogoutOutlined style={{ fontSize: 20 }} />}
        onClick={handleLogout}
        style={{
          color: "#072854",
          fontSize: 16,
          fontWeight: 500,
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#ff4d4f")}
        onMouseLeave={(e) => (e.target.style.color = "#072854")}
      >
        {!isMobile && "Sair"}
      </Button>
    </Header>
  );
}
