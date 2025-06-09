// src/services/publicationService.js
import apiClient from "./apiClient";

export default {
  fetch: (params) =>
    apiClient.get("/api/publications", { params }).then((r) => r.data),

  updateStatus: (id, status) =>
    apiClient
      .patch(`/api/publications/${id}/status`, { status })
      .then((r) => r.data),
};
