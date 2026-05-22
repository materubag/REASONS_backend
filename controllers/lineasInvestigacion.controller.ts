import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { LineaInvestigacion } from "../models";

export const getLineasInvestigacion = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = calculatePagination(req.query);
    const { count, rows } = await LineaInvestigacion.findAndCountAll({
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: rows,
      meta: buildPaginationMeta(page, limit, count),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron obtener las líneas de investigación",
      error,
    });
  }
};

export const getLineaInvestigacionById = async (req: Request, res: Response) => {
  try {
    const linea = await LineaInvestigacion.findByPk(Number(req.params.id));

    if (!linea) {
      return res.status(404).json({
        success: false,
        message: "Línea de investigación no encontrada",
      });
    }

    return res.json({ success: true, data: linea });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo obtener la línea de investigación",
      error,
    });
  }
};

export const createLineaInvestigacion = async (req: Request, res: Response) => {
  try {
    const linea = await LineaInvestigacion.create(req.body);

    return res.status(201).json({ success: true, data: linea });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo crear la línea de investigación",
      error,
    });
  }
};

export const updateLineaInvestigacion = async (req: Request, res: Response) => {
  try {
    const linea = await LineaInvestigacion.findByPk(Number(req.params.id));

    if (!linea) {
      return res.status(404).json({
        success: false,
        message: "Línea de investigación no encontrada",
      });
    }

    await linea.update(req.body);

    return res.json({ success: true, data: linea });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la línea de investigación",
      error,
    });
  }
};

export const patchLineaInvestigacion = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    const linea = await LineaInvestigacion.findByPk(Number(req.params.id));

    if (!linea) {
      return res.status(404).json({
        success: false,
        message: "Línea de investigación no encontrada",
      });
    }

    await linea.update(req.body);

    return res.json({ success: true, data: linea });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la línea de investigación",
      error,
    });
  }
};

export const deleteLineaInvestigacion = async (req: Request, res: Response) => {
  try {
    const linea = await LineaInvestigacion.findByPk(Number(req.params.id));

    if (!linea) {
      return res.status(404).json({
        success: false,
        message: "Línea de investigación no encontrada",
      });
    }

    await linea.destroy();

    return res.json({ success: true, message: "Línea de investigación eliminada" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo eliminar la línea de investigación",
      error,
    });
  }
};
