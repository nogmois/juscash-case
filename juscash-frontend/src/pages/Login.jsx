// src/pages/Login.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import logo from "@/assets/logo-novo.png";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function onFinish({ email, password }) {
    setError("");
    setLoading(true);
    try {
      const token = await authService.login(email, password);
      localStorage.setItem("token", token);
      nav("/");
    } catch (err) {
      if (err.response?.status === 401)
        setError("Credenciais inválidas. Verifique e tente novamente.");
      else setError("Ocorreu um problema. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Card
        style={{
          width: 500,
          height: 650,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{
          // aqui o truque:
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        {/* tudo isso vai ficar centralizado verticalmente */}
        <img
          src={logo}
          alt="JusCash"
          style={{ width: 280, marginBottom: 36 }}
        />

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 24, width: "100%", textAlign: "left" }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%", maxWidth: 360 }}
        >
          <Form.Item
            name="email"
            label={<span style={{ color: "#072854" }}>E-mail</span>}
            rules={[
              { required: true, message: "Informe o e-mail." },
              { type: "email", message: "Formato de e-mail inválido." },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#072854" }}>Senha</span>}
            rules={[{ required: true, message: "Informe a senha." }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              block
              style={{
                backgroundColor: "#2cbd62",
                borderColor: "#2cbd62",
                color: "#fff",
                height: 48,
                fontSize: 16,
              }}
            >
              Login
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Link to="/register" style={{ color: "#072854" }}>
              Não possui uma conta? Cadastre-se
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
