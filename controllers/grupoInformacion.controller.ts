import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { GrupoInformacion, GrupoObjetivo } from "../models";

// Helper to map and maintain 100% backward compatibility with the frontend
const mapGrupo = (grupo: any) => {
  if (!grupo) return null;
  const plain = grupo.toJSON ? grupo.toJSON() : grupo;

  // Reconstruct "objetivosEspecificos" as a single string joined by newlines
  if (plain.objetivosEspecificosList) {
    plain.objetivosEspecificos = plain.objetivosEspecificosList.map((o: any) => o.descripcion).join('\n');
    delete plain.objetivosEspecificosList;
  } else if (!plain.objetivosEspecificos) {
    plain.objetivosEspecificos = "";
  }

  return plain;
};

export const getGrupoInformacion = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = calculatePagination(req.query);
    const { count, rows } = await GrupoInformacion.findAndCountAll({
      include: [
        {
          model: GrupoObjetivo,
          as: "objetivosEspecificosList",
        },
      ],
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    const mappedRows = rows.map(row => mapGrupo(row));

    return res.json({
      success: true,
      data: mappedRows,
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
    const grupo = await GrupoInformacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: GrupoObjetivo,
          as: "objetivosEspecificosList",
        },
      ],
    });

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: "Información del grupo no encontrada",
      });
    }

    return res.json({ success: true, data: mapGrupo(grupo) });
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
    const { objetivosEspecificos, ...grupoData } = req.body;
    const grupo = await GrupoInformacion.create(grupoData);

    if (objetivosEspecificos) {
      const objArray = typeof objetivosEspecificos === "string"
        ? objetivosEspecificos.split('\n').map(o => o.trim()).filter(Boolean)
        : (Array.isArray(objetivosEspecificos) ? objetivosEspecificos : []);
      await GrupoObjetivo.bulkCreate(
        objArray.map((descripcion: string) => ({
          descripcion,
          grupoId: (grupo as any).id,
        }))
      );
    }

    const grupoConRelaciones = await GrupoInformacion.findByPk((grupo as any).id, {
      include: [
        {
          model: GrupoObjetivo,
          as: "objetivosEspecificosList",
        },
      ],
    });

    return res.status(201).json({ success: true, data: mapGrupo(grupoConRelaciones) });
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

    const { objetivosEspecificos, ...grupoData } = req.body;
    await grupo.update(grupoData);

    if (objetivosEspecificos !== undefined) {
      await GrupoObjetivo.destroy({ where: { grupoId: Number(req.params.id) } });
      if (objetivosEspecificos) {
        const objArray = typeof objetivosEspecificos === "string"
          ? objetivosEspecificos.split('\n').map(o => o.trim()).filter(Boolean)
          : (Array.isArray(objetivosEspecificos) ? objetivosEspecificos : []);
        await GrupoObjetivo.bulkCreate(
          objArray.map((descripcion: string) => ({
            descripcion,
            grupoId: Number(req.params.id),
          }))
        );
      }
    }

    const grupoConRelaciones = await GrupoInformacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: GrupoObjetivo,
          as: "objetivosEspecificosList",
        },
      ],
    });

    return res.json({ success: true, data: mapGrupo(grupoConRelaciones) });
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

    const { objetivosEspecificos, ...grupoData } = req.body;
    await grupo.update(grupoData);

    if (objetivosEspecificos !== undefined) {
      await GrupoObjetivo.destroy({ where: { grupoId: Number(req.params.id) } });
      if (objetivosEspecificos) {
        const objArray = typeof objetivosEspecificos === "string"
          ? objetivosEspecificos.split('\n').map(o => o.trim()).filter(Boolean)
          : (Array.isArray(objetivosEspecificos) ? objetivosEspecificos : []);
        await GrupoObjetivo.bulkCreate(
          objArray.map((descripcion: string) => ({
            descripcion,
            grupoId: Number(req.params.id),
          }))
        );
      }
    }

    const grupoConRelaciones = await GrupoInformacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: GrupoObjetivo,
          as: "objetivosEspecificosList",
        },
      ],
    });

    return res.json({ success: true, data: mapGrupo(grupoConRelaciones) });
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
