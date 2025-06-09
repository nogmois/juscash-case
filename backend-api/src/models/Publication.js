// src/models/Publication.js
import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Publication = sequelize.define(
  "Publication",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    processNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    authors: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lawyers: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    netValue: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    interestValue: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    attorneyFees: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    defendant: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Instituto Nacional do Seguro Social - INSS",
    },
    status: {
      type: DataTypes.ENUM("new", "read", "sent_adv", "done"),
      allowNull: false,
      defaultValue: "new",
    },
  },
  {
    tableName: "publications",
    timestamps: true, // cria createdAt e updatedAt automaticamente
    underscored: true, // opcional: usa snake_case nas colunas (created_at, updated_at)
  }
);
