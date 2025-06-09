// src/pages/Register.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import logo from "@/assets/logo-novo.png";

const { Title } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const passwordRules = [
    { required: true, message: "Informe a senha." },
    { min: 8, message: "Mínimo 8 caracteres." },
    { pattern: /[A-Z]/, message: "Deve conter ao menos uma letra maiúscula." },
    { pattern: /[a-z]/, message: "Deve conter ao menos uma letra minúscula." },
    { pattern: /\d/, message: "Deve conter ao menos um número." },
    {
      pattern: /[!@#$%^&*]/,
      message: "Deve conter ao menos um caractere especial.",
    },
  ];

  async function onFinish({ name, email, password, confirm }) {
    if (password !== confirm) {
      setError("A confirmação de senha não corresponde.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Cadastro
      await authService.register(name, email, password);

      // Login automático
      const token = await authService.login(email, password);
      localStorage.setItem("token", token);

      // Redireciona
      nav("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Erro ao cadastrar. Tente novamente."
      );
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
          height: 700,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="JusCash"
          style={{ width: 280, marginBottom: 36 }}
        />

        {/* Título */}
        <Title level={2} style={{ color: "#072854", marginBottom: 24 }}>
          Cadastro
        </Title>

        {/* Alerta de erro */}
        {error && (
          <Alert
            type="error"
            message={error}
            style={{ width: "100%", marginBottom: 24, textAlign: "left" }}
          />
        )}

        {/* Formulário */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ width: "100%", maxWidth: 360 }}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: "#072854" }}>Nome</span>}
            rules={[{ required: true, message: "Informe o nome." }]}
          >
            <Input size="large" />
          </Form.Item>

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
            rules={passwordRules}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={<span style={{ color: "#072854" }}>Confirme sua Senha</span>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirme a senha." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("password") === value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("A confirmação de senha não corresponde.")
                      );
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Link to="/login" style={{ color: "#072854" }}>
              Já possui uma conta? Fazer o login
            </Link>
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
              Criar conta
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
