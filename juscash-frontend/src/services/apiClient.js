// src/services/apiClient.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

// injeta automaticamente o JWT (se houver) em todas as requisições
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// intercepta respostas com erro
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // se receber 401, limpa o token e manda pra /login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
