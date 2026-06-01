import { Router } from "express";

import authRoutes from "./auth.routes";
import investigadoresRoutes from "./investigadores.routes";
import proyectosRoutes from "./proyectos.routes";
import publicacionesRoutes from "./publicaciones.routes";
import contactosRoutes from "./contactos.routes";
import lineasInvestigacionRoutes from "./lineasInvestigacion.routes";
import grupoInformacionRoutes from "./grupoInformacion.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/investigadores", investigadoresRoutes);

router.use("/proyectos", proyectosRoutes);

router.use("/publicaciones", publicacionesRoutes);

router.use("/contactos", contactosRoutes);

router.use(
  "/lineas-investigacion",
  lineasInvestigacionRoutes
);

router.use(
  "/grupo-informacion",
  grupoInformacionRoutes
);

export default router;