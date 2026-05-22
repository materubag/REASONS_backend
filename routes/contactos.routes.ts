import { Router } from "express";

import {
	createContacto,
	deleteContacto,
	getContactoById,
	getContactos,
} from "../controllers/contactos.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { contactoSchema } from "../schemas/contacto.schema";

const router = Router();

router.get("/", getContactos);
router.get("/:id", getContactoById);
router.post("/", validate(contactoSchema), createContacto);
router.delete("/:id", authMiddleware, deleteContacto);

export default router;

