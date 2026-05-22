import { Router } from "express";

import {
	createInvestigador,
	deleteInvestigador,
	getInvestigadorById,
	getInvestigadores,
	patchInvestigador,
	updateInvestigador,
} from "../controllers/investigadores.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import { stripEmptyStrings, validate } from "../middlewares/validate.middleware";
import { investigadorPatchSchema, investigadorSchema } from "../schemas/investigador.schema";

const router = Router();

router.get("/", getInvestigadores);
router.get("/:id", getInvestigadorById);
router.post("/", authMiddleware, ...uploadSingle("foto"), validate(investigadorSchema), createInvestigador);
router.put("/:id", authMiddleware, ...uploadSingle("foto"), validate(investigadorSchema), updateInvestigador);
router.patch(
	"/:id",
	authMiddleware,
	...uploadSingle("foto"),
	stripEmptyStrings,
	validate(investigadorPatchSchema),
	patchInvestigador
);
router.delete("/:id", authMiddleware, deleteInvestigador);

export default router;

