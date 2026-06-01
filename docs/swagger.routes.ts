import { Router } from "express";

import swaggerSpec from "./swagger";
import { getSwaggerHtml } from "./swaggerHtml";

const router = Router();

router.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

router.get("/api-docs", (_req, res) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://unpkg.com; script-src 'self' 'unsafe-inline' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; connect-src 'self' https://unpkg.com; img-src 'self' data:;"
  );

  res.type("html").send(getSwaggerHtml());
});

export default router;