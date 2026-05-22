import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado",
    });
  }

  const token = header.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }

  (req as any).user = payload;
  return next();
};
