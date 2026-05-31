import { z } from "zod";

const parseStringArray = (val: any) => {
  if (typeof val === "string") {
    if (val.trim() === "") return [];
    try {
      return JSON.parse(val);
    } catch {
      return val.split(",").map((k: string) => k.trim()).filter(Boolean);
    }
  }
  return val;
};

const parseNumberArray = (val: any) => {
  if (typeof val === "string") {
    if (val.trim() === "") return [];
    try {
      return JSON.parse(val);
    } catch {
      return val.split(",").map((id: string) => Number(id.trim())).filter((id: number) => !isNaN(id));
    }
  }
  return val;
};

export const proyectoSchema = z.object({
  titulo: z.string().min(5),

  descripcion: z.string().min(20),

  descripcionExtendida: z.string().optional().nullable(),

  objetivos: z.string().min(10),

  resultados: z.string().optional().nullable(),

  imagen: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? null : arg),
    z.string().optional().nullable()
  ),

  fechaInicio: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? null : arg),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha de inicio inválido (YYYY-MM-DD)" }).optional().nullable()
  ),

  fechaFin: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? null : arg),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Formato de fecha de fin inválido (YYYY-MM-DD)" }).optional().nullable()
  ),

  keywords: z.preprocess(
    parseStringArray,
    z.array(z.string()).default([])
  ),

  investigadores: z.preprocess(
    parseNumberArray,
    z.array(z.number().int().positive()).optional()
  ),

  lineas: z.preprocess(
    parseNumberArray,
    z.array(z.number().int().positive()).optional()
  ),
});

export const proyectoPatchSchema = proyectoSchema.partial().strict();