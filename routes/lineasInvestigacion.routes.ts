import { Router } from "express";

import {
  createLineaInvestigacion,
  deleteLineaInvestigacion,
  getLineaInvestigacionById,
  getLineasInvestigacion,
  patchLineaInvestigacion,
  updateLineaInvestigacion,
} from "../controllers/lineasInvestigacion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { stripEmptyStrings, validate } from "../middlewares/validate.middleware";
import { lineaInvestigacionPatchSchema, lineaInvestigacionSchema } from "../schemas/lineaInvestigacion.schema";

const router = Router();

router.get("/", getLineasInvestigacion);
router.get("/:id", getLineaInvestigacionById);
router.post("/", authMiddleware, validate(lineaInvestigacionSchema), createLineaInvestigacion);
router.put("/:id", authMiddleware, validate(lineaInvestigacionSchema), updateLineaInvestigacion);
router.patch(
  "/:id",
  authMiddleware,
  stripEmptyStrings,
  validate(lineaInvestigacionPatchSchema),
  patchLineaInvestigacion
);
router.delete("/:id", authMiddleware, deleteLineaInvestigacion);

export default router;
