import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes";
import microsoftAuthRoutes from "./routes/auth.microsoft.routes";
import swaggerRoutes from "./docs/swagger.routes";

import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

const isDev = process.env.IS_DEV === "true";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ✅ FIX: Helmet solo en producción, o configuralo correctamente
if (!isDev) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
} else {
  // En desarrollo, usa helmet sin CSP restrictiva
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false, // ← Permite Swagger
    })
  );
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

if (isDev) {
  app.use(swaggerRoutes);
}

app.use("/api", routes);
app.use(microsoftAuthRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "REASONS API funcionando",
  });
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
