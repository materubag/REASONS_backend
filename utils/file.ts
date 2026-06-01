import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

/**
 * Obtener la ruta completa de un archivo
 */
export const getFilePath = (relativePath: string): string => {
  return path.join(UPLOAD_DIR, relativePath);
};

/**
 * Eliminar un archivo del sistema
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const fullPath = getFilePath(filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

/**
 * Eliminar múltiples archivos
 */
export const deleteFiles = async (filePaths: string[]): Promise<boolean> => {
  try {
    for (const filePath of filePaths) {
      await deleteFile(filePath);
    }
    return true;
  } catch (error) {
    console.error("Error deleting files:", error);
    return false;
  }
};

/**
 * Crear directorio si no existe
 */
export const ensureDir = (dirPath: string): void => {
  const fullPath = getFilePath(dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

/**
 * Verificar si un archivo existe
 */
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(getFilePath(filePath));
};

/**
 * Obtener extensión de un archivo
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

/**
 * Generar nombre único para archivo
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  const ext = getFileExtension(originalName);
  const nameWithoutExt = path.basename(originalName, ext);

  return `${nameWithoutExt}-${timestamp}-${random}${ext}`;
};

/**
 * Validar extensión de archivo
 */
export const isValidFileExtension = (
  filename: string,
  allowedExtensions: string[]
): boolean => {
  const ext = getFileExtension(filename);
  return allowedExtensions.includes(ext);
};

/**
 * Obtener el tamaño de un archivo en bytes
 */
export const getFileSize = (filePath: string): number => {
  try {
    const fullPath = getFilePath(filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return stats.size;
    }
    return 0;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error);
    return 0;
  }
};
