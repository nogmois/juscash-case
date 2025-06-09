//src/middleware/auth.js

import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente" });

  const [, token] = authHeader.split(" ");
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};
