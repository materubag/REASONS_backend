import { Router } from "express";
import { microsoftLogin, microsoftCallback } from "../controllers/auth.microsoft.controller";

const router = Router();

router.get("/auth/microsoft/login", microsoftLogin);
router.get("/auth/microsoft/callback", microsoftCallback);

export default router;
