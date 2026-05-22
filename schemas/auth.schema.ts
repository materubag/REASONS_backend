import { z } from "zod";

export const loginSchema = z.object({
  correo: z.email(),

  password: z.string().min(6),
});

export const registerSchema = z.object({
  nombre: z.string().min(3),

  correo: z.email(),

  password: z.string().min(6),
});