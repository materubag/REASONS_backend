import { Router } from "express";

import { login, listUsers, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.get("/usuarios", authMiddleware, listUsers);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;

