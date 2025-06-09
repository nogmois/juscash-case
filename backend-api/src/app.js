//src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "./database.js";

// importe o authRouter
import authRouter from "./routes/auth.js";
// mantenha o publicationsRouter
import publicationsRouter from "./routes/publications.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de autenticação (não precisam de token)
app.use("/api/auth", authRouter);

// Rotas protegidas de publicações (precisam de JWT)
app.use("/api/publications", publicationsRouter);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ Database conectado e sincronizado");
    app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
  } catch (err) {
    console.error("❌ Falha ao conectar ao banco:", err);
  }
})();
