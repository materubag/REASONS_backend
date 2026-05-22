import { z } from "zod";

export const lineaInvestigacionSchema = z.object({
  nombre: z.string().min(5),

  descripcion: z.string().min(20),
});

export const lineaInvestigacionPatchSchema = lineaInvestigacionSchema.partial().strict();