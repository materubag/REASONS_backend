import { z } from "zod";

export const investigadorSchema = z.object({
  nombre: z.string().min(5).max(150),

  orcid: z.string().regex(
    /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
    "ORCID inválido"
  ),

  correo: z.email(),

  biografia: z.string().min(20),

  cargo: z.string().min(3),

  foto: z.string().optional(),

  linkedin: z.url().optional(),

  facebook: z.url().optional(),

  instagram: z.url().optional(),

  telegram: z.string().optional(),
});

export const investigadorPatchSchema = investigadorSchema.partial().strict();