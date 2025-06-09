// src/services/authService.js
import apiClient from "./apiClient";

export default {
  login: (email, password) =>
    apiClient
      .post("/api/auth/login", { email, password })
      .then((res) => res.data.access_token),

  register: (name, email, password) =>
    apiClient
      .post("/api/auth/register", { name, email, password })
      .then((res) => res.data),
};
