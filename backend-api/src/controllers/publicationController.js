// src/controllers/publicationController.js
import { Publication } from "../models/Publication.js";
import { Op } from "sequelize";

export const filterPublications = async (req, res) => {
  const { query, status, from, to } = req.query;
  const where = {};

  if (query) {
    where[Op.or] = [
      { processNumber: { [Op.iLike]: `%${query}%` } },
      { authors: { [Op.iLike]: `%${query}%` } }, // <-- corrigido
      { defendant: { [Op.iLike]: `%${query}%` } },
      { lawyers: { [Op.iLike]: `%${query}%` } }, // <-- corrigido
    ];
  }

  if (status) {
    where.status = status;
  }

  if (from || to) {
    where.publicationDate = {};
    if (from) where.publicationDate[Op.gte] = from;
    if (to) where.publicationDate[Op.lte] = to;
  }

  try {
    const list = await Publication.findAll({
      where,
      order: [["publicationDate", "DESC"]],
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar publicações." });
  }
};

export const getPublicationById = async (req, res) => {
  try {
    const pub = await Publication.findByPk(req.params.id);
    if (!pub)
      return res.status(404).json({ error: "Publicação não encontrada." });
    res.json(pub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar publicação." });
  }
};

// src/controllers/publicationController.js
export const updatePublicationStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status é obrigatório." });
  }

  try {
    const pub = await Publication.findByPk(req.params.id);
    if (!pub) {
      return res.status(404).json({ error: "Publicação não encontrada." });
    }
    pub.status = status;
    await pub.save();
    return res.json(pub);
  } catch (err) {
    console.error("⚠️ updatePublicationStatus erro:", err);
    return res.status(500).json({ error: "Erro ao atualizar status." });
  }
};
