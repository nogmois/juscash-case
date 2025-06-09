// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Kanban from "@/pages/Kanban";
import PrivateRoute from "@/components/PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Kanban />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
