import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "reasons-secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

interface TokenPayload {
  id: number;
  correo: string;
  rol: string;
  [key: string]: any;
}

/**
 * Generar un nuevo token JWT
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY as any,
  });
};

/**
 * Verificar y decodificar un token JWT
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Verificar si un token es válido sin decodificarlo
 */
export const isTokenValid = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

/**
 * Decodificar un token sin verificar la firma
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};
