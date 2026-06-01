import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().min(5),

  correo: z.email(),

  mensaje: z.string().min(10).max(2000),
});