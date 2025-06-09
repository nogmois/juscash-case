// src/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,

    // ← aqui começa a adição
    timezone: "-03:00", // garante que createdAt/updatedAt use UTC−3
    dialectOptions: {
      useUTC: false, // lê do banco como hora local (já em -03:00)
    },
    // ← fim da adição
  }
);
