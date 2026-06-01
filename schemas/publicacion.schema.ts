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

export const publicacionSchema = z.object({
  titulo: z.string().min(5),

  autores: z.string().min(5),

  resumen: z.string().min(20),

  cita: z.string().min(10),

  portada: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? null : arg),
    z.string().optional().nullable()
  ),

  doi: z.string().optional().nullable(),

  url: z.preprocess(
    (arg) => (typeof arg === "string" && arg.trim() === "" ? null : arg),
    z.string().url().optional().nullable()
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

export const publicacionPatchSchema = publicacionSchema.partial().strict();