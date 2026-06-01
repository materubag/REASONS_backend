import { Router } from "express";

import {
	createProyecto,
	deleteProyecto,
	getProyectoById,
	getProyectos,
	patchProyecto,
	updateProyecto,
} from "../controllers/proyectos.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import { stripEmptyStrings, validate } from "../middlewares/validate.middleware";
import { proyectoPatchSchema, proyectoSchema } from "../schemas/proyecto.schema";

const router = Router();

router.get("/", getProyectos);
router.get("/:id", getProyectoById);
router.post("/", authMiddleware, ...uploadSingle("imagen"), validate(proyectoSchema), createProyecto);
router.put("/:id", authMiddleware, ...uploadSingle("imagen"), validate(proyectoSchema), updateProyecto);
router.patch(
	"/:id",
	authMiddleware,
	...uploadSingle("imagen"),
	stripEmptyStrings,
	validate(proyectoPatchSchema),
	patchProyecto
);
router.delete("/:id", authMiddleware, deleteProyecto);

export default router;

