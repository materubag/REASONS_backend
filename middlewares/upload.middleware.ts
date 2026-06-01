import { NextFunction, Request, Response } from "express";
import path from "path";
import { validateUploadFile, UploadType, getUploadConfig } from "../services/upload.service";
import { createUploadMiddleware } from "./multer.middleware";

/**
 * Mapeo de fieldName a carpeta de upload
 */
const fieldToFolder: Record<string, string> = {
  foto: "investigadores",
  portada: "publicaciones",
  imagen: "proyectos",
  logo: "grupo_informacion",
};

/**
 * Middleware para validar archivos de upload
 */
export const validateUploadMiddleware = (uploadType: UploadType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionó archivo",
      });
    }

    // Validar archivo
    const validation = validateUploadFile(uploadType, req.file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Archivo no válido",
        error: validation.error,
      });
    }

    // Agregar información del archivo al request
    const config = getUploadConfig(uploadType);
    req.body.filename = req.file.filename;
    req.body.filepath = `${config.folder}/${req.file.filename}`;
    req.body.filesize = req.file.size;

    return next();
  };
};

/**
 * Middleware genérico compatible con spread operator
 * Devuelve un array de middlewares para usar con ...uploadSingle()
 */
export const uploadSingle = (fieldName: string) => {
  const folder = fieldToFolder[fieldName] || fieldName;
  const handler = createUploadMiddleware(folder).single(fieldName);

  return [
    handler,
    (req: Request, _res: Response, next: NextFunction) => {
      if (req.file) {
        req.body[fieldName] = `/uploads/${folder}/${req.file.filename}`;
      }
      return next();
    },
  ];
};

export const uploadGrupoFiles = () => {
  const handler = createUploadMiddleware("grupo_informacion").fields([
    { name: "logo", maxCount: 1 },
    { name: "portada", maxCount: 1 },
    { name: "miniLogo", maxCount: 1 },
  ]);

  return [
    handler,
    (req: Request, _res: Response, next: NextFunction) => {
      if (req.files) {
        const files = req.files as { [fieldName: string]: Express.Multer.File[] };
        if (files["logo"] && files["logo"][0]) {
          req.body.logo = `/uploads/grupo_informacion/${files["logo"][0].filename}`;
        }
        if (files["portada"] && files["portada"][0]) {
          req.body.portada = `/uploads/grupo_informacion/${files["portada"][0].filename}`;
        }
        if (files["miniLogo"] && files["miniLogo"][0]) {
          req.body.miniLogo = `/uploads/grupo_informacion/${files["miniLogo"][0].filename}`;
        }
      }
      return next();
    },
  ];
};
