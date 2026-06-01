import { Router } from "express";

import {
  createGrupoInformacion,
  deleteGrupoInformacion,
  getGrupoInformacion,
  getGrupoInformacionById,
  patchGrupoInformacion,
  updateGrupoInformacion,
} from "../controllers/grupoInformacion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadGrupoFiles } from "../middlewares/upload.middleware";
import { stripEmptyStrings, validate } from "../middlewares/validate.middleware";
import { grupoInformacionPatchSchema, grupoInformacionSchema } from "../schemas/grupoInformacion.schema";

const router = Router();

router.get("/", getGrupoInformacion);
router.get("/:id", getGrupoInformacionById);
router.post("/", authMiddleware, ...uploadGrupoFiles(), validate(grupoInformacionSchema), createGrupoInformacion);
router.put("/:id", authMiddleware, ...uploadGrupoFiles(), validate(grupoInformacionSchema), updateGrupoInformacion);
router.patch(
  "/:id",
  authMiddleware,
  ...uploadGrupoFiles(),
  stripEmptyStrings,
  validate(grupoInformacionPatchSchema),
  patchGrupoInformacion
);
router.delete("/:id", authMiddleware, deleteGrupoInformacion);

export default router;
