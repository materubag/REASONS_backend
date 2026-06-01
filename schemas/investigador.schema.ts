import { z } from "zod";

const parseOptionalUrl = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().url().optional().nullable()
);

const parseOptionalString = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? null : val),
  z.string().optional().nullable()
);

export const investigadorSchema = z.object({
  nombre: z.string().min(5).max(150),

  orcid: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z.string().regex(
      /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
      "ORCID inválido"
    )
  ),

  correo: z.email(),

  biografia: z.string().min(20),

  cargo: z.enum(["Director", "Subdirector", "Investigador"]),

  foto: parseOptionalString,

  linkedin: parseOptionalUrl,

  facebook: parseOptionalUrl,

  instagram: parseOptionalUrl,

  telegram: parseOptionalString,
});

export const investigadorPatchSchema = investigadorSchema.partial().strict();