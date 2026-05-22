import { z } from "zod";

export const proyectoSchema = z.object({
  titulo: z.string().min(5),

  descripcion: z.string().min(20),

  objetivos: z.string().min(10),

  resultados: z.string().optional(),

  imagen: z.string().optional(),
});

export const proyectoPatchSchema = proyectoSchema.partial().strict();