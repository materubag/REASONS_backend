import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { verifyToken } from "./utils/jwt";
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

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // 1000 requests per 15 minutes for regular users
    skip: (req) => {
      const header = req.headers.authorization;
      if (header && header.startsWith("Bearer ")) {
        const token = header.slice(7);
        const payload = verifyToken(token);
        if (payload && payload.rol === "admin") {
          return true; // Skip rate limit for admin users
        }
      }
      return false;
    },
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