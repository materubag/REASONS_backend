import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { GrupoInformacion } from "../models";

export const getGrupoInformacion = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = calculatePagination(req.query);
    const { count, rows } = await GrupoInformacion.findAndCountAll({
      order: [["id", "ASC"]],
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
      message: "No se pudo obtener la información del grupo",
      error,
    });
  }
};

export const getGrupoInformacionById = async (req: Request, res: Response) => {
  try {
    const grupo = await GrupoInformacion.findByPk(Number(req.params.id));

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: "Información del grupo no encontrada",
      });
    }

    return res.json({ success: true, data: grupo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo obtener la información del grupo",
      error,
    });
  }
};

export const createGrupoInformacion = async (req: Request, res: Response) => {
  try {
    const grupo = await GrupoInformacion.create(req.body);

    return res.status(201).json({ success: true, data: grupo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo crear la información del grupo",
      error,
    });
  }
};

export const updateGrupoInformacion = async (req: Request, res: Response) => {
  try {
    const grupo = await GrupoInformacion.findByPk(Number(req.params.id));

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: "Información del grupo no encontrada",
      });
    }

    await grupo.update(req.body);

    return res.json({ success: true, data: grupo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la información del grupo",
      error,
    });
  }
};

export const patchGrupoInformacion = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    const grupo = await GrupoInformacion.findByPk(Number(req.params.id));

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: "Información del grupo no encontrada",
      });
    }

    await grupo.update(req.body);

    return res.json({ success: true, data: grupo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la información del grupo",
      error,
    });
  }
};

export const deleteGrupoInformacion = async (req: Request, res: Response) => {
  try {
    const grupo = await GrupoInformacion.findByPk(Number(req.params.id));

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: "Información del grupo no encontrada",
      });
    }

    await grupo.destroy();

    return res.json({ success: true, message: "Información del grupo eliminada" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo eliminar la información del grupo",
      error,
    });
  }
};
