import { Router } from "express";

import {
	createPublicacion,
	deletePublicacion,
	getPublicacionById,
	getPublicaciones,
	patchPublicacion,
	updatePublicacion,
} from "../controllers/publicaciones.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import { stripEmptyStrings, validate } from "../middlewares/validate.middleware";
import { publicacionPatchSchema, publicacionSchema } from "../schemas/publicacion.schema";

const router = Router();

router.get("/", getPublicaciones);
router.get("/:id", getPublicacionById);
router.post("/", authMiddleware, ...uploadSingle("portada"), validate(publicacionSchema), createPublicacion);
router.put("/:id", authMiddleware, ...uploadSingle("portada"), validate(publicacionSchema), updatePublicacion);
router.patch(
	"/:id",
	authMiddleware,
	...uploadSingle("portada"),
	stripEmptyStrings,
	validate(publicacionPatchSchema),
	patchPublicacion
);
router.delete("/:id", authMiddleware, deletePublicacion);

export default router;

