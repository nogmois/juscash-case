//src/controllers/authController

import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, e-mail e senha são obrigatórios." });
  }
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.status(400).json({ error: "E-mail já cadastrado." });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }
  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ access_token: token });
};
