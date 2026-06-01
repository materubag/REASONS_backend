import path from "path";
import { deleteFile, isValidFileExtension, generateUniqueFilename, ensureDir } from "../utils/file";

// Tipos de upload permitidos
export enum UploadType {
  INVESTIGADORES = "investigadores",
  LOGOS = "logos",
  PROYECTOS = "proyectos",
  PUBLICACIONES = "publicaciones",
  GRUPO_INFORMACION = "grupo_informacion",
}

// Configuración por tipo de upload
const UPLOAD_CONFIG: Record<UploadType, {
  folder: string;
  allowedExtensions: string[];
  maxFileSize: number; // en bytes
  description: string;
}> = {
  [UploadType.INVESTIGADORES]: {
    folder: "investigadores",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    description: "Fotos de investigadores",
  },
  [UploadType.LOGOS]: {
    folder: "logos",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".svg", ".webp"],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    description: "Logos",
  },
  [UploadType.PROYECTOS]: {
    folder: "proyectos",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    description: "Imágenes de proyectos",
  },
  [UploadType.PUBLICACIONES]: {
    folder: "publicaciones",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".pdf", ".webp"],
    maxFileSize: 15 * 1024 * 1024, // 15MB
    description: "Portadas de publicaciones",
  },
  [UploadType.GRUPO_INFORMACION]: {
    folder: "grupo_informacion",
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxFileSize: 8 * 1024 * 1024, // 8MB
    description: "Imágenes del grupo",
  },
};

interface UploadFileParams {
  type: UploadType;
  file: {
    originalname: string;
    size: number;
    buffer?: Buffer;
  };
}

interface UploadResult {
  success: boolean;
  message: string;
  filename?: string;
  relativePath?: string;
  url?: string;
  error?: string;
}

/**
 * Validar que el tipo de upload sea válido
 */
export const isValidUploadType = (type: string): boolean => {
  return Object.values(UploadType).includes(type as UploadType);
};

/**
 * Obtener configuración de upload para un tipo
 */
export const getUploadConfig = (type: UploadType) => {
  return UPLOAD_CONFIG[type];
};

/**
 * Validar archivo antes de subir
 */
export const validateUploadFile = (
  type: UploadType,
  file: { originalname: string; size: number }
): { isValid: boolean; error?: string } => {
  const config = UPLOAD_CONFIG[type];

  // Validar extensión
  if (!isValidFileExtension(file.originalname, config.allowedExtensions)) {
    return {
      isValid: false,
      error: `Extensión no permitida. Extensiones válidas: ${config.allowedExtensions.join(", ")}`,
    };
  }

  // Validar tamaño
  if (file.size > config.maxFileSize) {
    const maxMB = config.maxFileSize / (1024 * 1024);
    return {
      isValid: false,
      error: `El archivo supera el tamaño máximo de ${maxMB}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Procesar upload de archivo
 */
export const processUploadFile = async (
  params: UploadFileParams
): Promise<UploadResult> => {
  try {
    const { type, file } = params;
    const config = UPLOAD_CONFIG[type];

    // Validar tipo de upload
    if (!isValidUploadType(type)) {
      return {
        success: false,
        message: "Tipo de upload no válido",
        error: `Tipos válidos: ${Object.values(UploadType).join(", ")}`,
      };
    }

    // Validar archivo
    const validation = validateUploadFile(type, file);
    if (!validation.isValid) {
      return {
        success: false,
        message: "Archivo no válido",
        error: validation.error,
      };
    }

    // Asegurar que el directorio existe
    ensureDir(config.folder);

    // Generar nombre único
    const uniqueFilename = generateUniqueFilename(file.originalname);
    const relativePath = path.join(config.folder, uniqueFilename);

    return {
      success: true,
      message: `Archivo preparado para guardar en ${config.description}`,
      filename: uniqueFilename,
      relativePath: relativePath.replace(/\\/g, "/"),
      url: `/uploads/${relativePath.replace(/\\/g, "/")}`,
    };
  } catch (error) {
    console.error("Error in processUploadFile:", error);
    return {
      success: false,
      message: "Error procesando el archivo",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Eliminar archivo de upload
 */
export const deleteUploadFile = async (
  type: UploadType,
  filename: string
): Promise<UploadResult> => {
  try {
    const config = UPLOAD_CONFIG[type];
    const relativePath = path.join(config.folder, filename);

    const deleted = await deleteFile(relativePath);

    if (deleted) {
      return {
        success: true,
        message: "Archivo eliminado exitosamente",
      };
    } else {
      return {
        success: false,
        message: "No se encontró el archivo para eliminar",
      };
    }
  } catch (error) {
    console.error("Error in deleteUploadFile:", error);
    return {
      success: false,
      message: "Error eliminando el archivo",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Reemplazar archivo
 */
export const replaceUploadFile = async (
  type: UploadType,
  oldFilename: string,
  newFile: { originalname: string; size: number }
): Promise<UploadResult> => {
  try {
    // Validar nuevo archivo
    const validation = validateUploadFile(type, newFile);
    if (!validation.isValid) {
      return {
        success: false,
        message: "Archivo no válido",
        error: validation.error,
      };
    }

    // Eliminar archivo anterior
    await deleteUploadFile(type, oldFilename);

    // Procesar nuevo archivo
    return await processUploadFile({
      type,
      file: newFile,
    });
  } catch (error) {
    console.error("Error in replaceUploadFile:", error);
    return {
      success: false,
      message: "Error reemplazando el archivo",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Obtener lista de extensiones permitidas para un tipo
 */
export const getAllowedExtensions = (type: UploadType): string[] => {
  return UPLOAD_CONFIG[type].allowedExtensions;
};

/**
 * Obtener tamaño máximo permitido para un tipo
 */
export const getMaxFileSize = (type: UploadType): number => {
  return UPLOAD_CONFIG[type].maxFileSize;
};

/**
 * Obtener descripción de un tipo de upload
 */
export const getUploadDescription = (type: UploadType): string => {
  return UPLOAD_CONFIG[type].description;
};
