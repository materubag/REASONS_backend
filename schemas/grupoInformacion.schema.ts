import { z } from "zod";

export const grupoInformacionSchema = z.object({
  nombre: z.string().min(3),

  descripcion: z.string().min(20),

  objetivoGeneral: z.string().min(20),

  objetivosEspecificos: z.string().min(20),

  dominio: z.string().min(5),

  direccion: z.string().min(10),

  correo: z.email(),

  logo: z.string().optional(),
});

export const grupoInformacionPatchSchema = grupoInformacionSchema.partial().strict();