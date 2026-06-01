import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

type Source = "body" | "params" | "query";

export const stripEmptyStrings = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (typeof value === "string" && value.trim() === "") {
        delete req.body[key];
      }
    });
  }

  return next();
};

export const validate = (schema: ZodTypeAny, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos",
        errors: result.error.flatten(),
      });
    }

    req[source] = result.data;
    return next();
  };
};
