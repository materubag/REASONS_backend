import { z } from "zod";

export const publicacionSchema = z.object({
  titulo: z.string().min(5),

  autores: z.string().min(5),

  resumen: z.string().min(20),

  cita: z.string().min(10),

  portada: z.string().optional(),

  doi: z.string().optional(),

  url: z.url().optional(),
});

export const publicacionPatchSchema = publicacionSchema.partial().strict();