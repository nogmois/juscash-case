// src/routes/publications.js
import { Router } from "express";
import {
  filterPublications,
  getPublicationById,
  updatePublicationStatus,
} from "../controllers/publicationController.js";
import auth from "../middleware/auth.js";

const router = Router();

// aplica JWT a todas as rotas abaixo
router.use(auth);

// lista/filtro
router.get("/", filterPublications);
// busca por id
router.get("/:id", getPublicationById);
// atualiza status
router.patch("/:id/status", updatePublicationStatus);

export default router;
