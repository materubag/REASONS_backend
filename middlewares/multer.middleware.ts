import multer from "multer";
import path from "path";
import fs from "fs";
import { generateUniqueFilename, ensureDir } from "../utils/file";

const uploadsRoot = path.join(process.cwd(), "uploads");

// Asegurar que el directorio raíz existe
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

/**
 * Configurar multer para un tipo de upload específico
 */
export const createUploadMiddleware = (uploadFolder: string) => {
  ensureDir(uploadFolder);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const destPath = path.join(uploadsRoot, uploadFolder);
      cb(null, destPath);
    },
    filename: (_req, file, cb) => {
      const uniqueName = generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: 15 * 1024 * 1024, // 15MB máximo
    },
  });
};

/**
 * Middleware genérico para subir un archivo único
 */
export const uploadSingleGeneric = (uploadFolder: string, fieldName: string) => {
  const upload = createUploadMiddleware(uploadFolder);
  return upload.single(fieldName);
};

/**
 * Middleware genérico para subir múltiples archivos
 */
export const uploadMultipleGeneric = (uploadFolder: string, fieldName: string, maxFiles: number = 10) => {
  const upload = createUploadMiddleware(uploadFolder);
  return upload.array(fieldName, maxFiles);
};

/**
 * Middleware para investigadores
 */
export const uploadInvestigador = uploadSingleGeneric("investigadores", "foto");

/**
 * Middleware para logos
 */
export const uploadLogo = uploadSingleGeneric("logos", "logo");

/**
 * Middleware para proyectos
 */
export const uploadProyecto = uploadSingleGeneric("proyectos", "imagen");

/**
 * Middleware para publicaciones
 */
export const uploadPublicacion = uploadSingleGeneric("publicaciones", "portada");

/**
 * Middleware para grupo de información
 */
export const uploadGrupoInformacion = uploadSingleGeneric("grupo_informacion", "imagen");
