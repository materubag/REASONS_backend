import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes";
import swaggerRoutes from "./docs/swagger.routes";

import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

const isDev =
  process.env.IS_DEV === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.npm_lifecycle_event === "dev";

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

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "REASONS API funcionando",
  });
});

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;