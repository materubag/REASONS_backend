import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Publicacion, Investigador, LineaInvestigacion, PublicacionKeyword } from "../models";

// Helper to map and maintain 100% backward compatibility with the frontend
const mapPublicacion = (publicacion: any) => {
  if (!publicacion) return null;
  const plain = publicacion.toJSON ? publicacion.toJSON() : publicacion;

  // Reconstruct "keywords" as an array of strings
  if (plain.keywordsList) {
    plain.keywords = plain.keywordsList.map((k: any) => k.nombre);
    delete plain.keywordsList;
  } else if (!plain.keywords) {
    plain.keywords = [];
  }

  return plain;
};

export const getPublicaciones = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = calculatePagination(req.query);
    const { count, rows } = await Publicacion.findAndCountAll({
      include: [
        {
          model: Investigador,
          as: "investigadores",
          through: { attributes: [] },
        },
        {
          model: LineaInvestigacion,
          as: "lineas",
          through: { attributes: [] },
        },
        {
          model: PublicacionKeyword,
          as: "keywordsList",
        },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const mappedRows = rows.map(row => mapPublicacion(row));

    return res.json({
      success: true,
      data: mappedRows,
      meta: buildPaginationMeta(page, limit, count),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron obtener las publicaciones",
      error,
    });
  }
};

export const getPublicacionById = async (req: Request, res: Response) => {
  try {
    const publicacion = await Publicacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: Investigador,
          as: "investigadores",
          through: { attributes: [] },
        },
        {
          model: LineaInvestigacion,
          as: "lineas",
          through: { attributes: [] },
        },
        {
          model: PublicacionKeyword,
          as: "keywordsList",
        },
      ],
    });

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        message: "Publicación no encontrada",
      });
    }

    return res.json({ success: true, data: mapPublicacion(publicacion) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo obtener la publicación",
      error,
    });
  }
};

export const createPublicacion = async (req: Request, res: Response) => {
  try {
    const { investigadores, lineas, keywords, ...publicacionData } = req.body;
    const publicacion = await Publicacion.create(publicacionData);

    if (investigadores && investigadores.length > 0) {
      await (publicacion as any).setInvestigadores(investigadores);
    }
    if (lineas && lineas.length > 0) {
      await (publicacion as any).setLineas(lineas);
    }

    // Save keywords into the PublicacionKeyword table
    if (keywords) {
      const kwArray = typeof keywords === "string"
        ? JSON.parse(keywords)
        : (Array.isArray(keywords) ? keywords : []);
      await PublicacionKeyword.bulkCreate(
        kwArray.map((nombre: string) => ({
          nombre,
          publicacionId: (publicacion as any).id,
        }))
      );
    }

    const publicacionConRelaciones = await Publicacion.findByPk((publicacion as any).id, {
      include: [
        {
          model: Investigador,
          as: "investigadores",
          through: { attributes: [] },
        },
        {
          model: LineaInvestigacion,
          as: "lineas",
          through: { attributes: [] },
        },
        {
          model: PublicacionKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.status(201).json({ success: true, data: mapPublicacion(publicacionConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo crear la publicación",
      error,
    });
  }
};

export const updatePublicacion = async (req: Request, res: Response) => {
  try {
    const publicacion = await Publicacion.findByPk(Number(req.params.id));

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        message: "Publicación no encontrada",
      });
    }

    const { investigadores, lineas, keywords, ...publicacionData } = req.body;
    await publicacion.update(publicacionData);

    if (investigadores !== undefined) {
      await (publicacion as any).setInvestigadores(investigadores);
    }
    if (lineas !== undefined) {
      await (publicacion as any).setLineas(lineas);
    }

    // Update keywords: delete existing and bulkCreate new
    if (keywords !== undefined) {
      await PublicacionKeyword.destroy({ where: { publicacionId: Number(req.params.id) } });
      if (keywords) {
        const kwArray = typeof keywords === "string"
          ? JSON.parse(keywords)
          : (Array.isArray(keywords) ? keywords : []);
        await PublicacionKeyword.bulkCreate(
          kwArray.map((nombre: string) => ({
            nombre,
            publicacionId: Number(req.params.id),
          }))
        );
      }
    }

    const publicacionConRelaciones = await Publicacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: Investigador,
          as: "investigadores",
          through: { attributes: [] },
        },
        {
          model: LineaInvestigacion,
          as: "lineas",
          through: { attributes: [] },
        },
        {
          model: PublicacionKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.json({ success: true, data: mapPublicacion(publicacionConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la publicación",
      error,
    });
  }
};

export const patchPublicacion = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    const publicacion = await Publicacion.findByPk(Number(req.params.id));

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        message: "Publicación no encontrada",
      });
    }

    const { investigadores, lineas, keywords, ...publicacionData } = req.body;
    await publicacion.update(publicacionData);

    if (investigadores !== undefined) {
      await (publicacion as any).setInvestigadores(investigadores);
    }
    if (lineas !== undefined) {
      await (publicacion as any).setLineas(lineas);
    }

    // Update keywords: delete existing and bulkCreate new
    if (keywords !== undefined) {
      await PublicacionKeyword.destroy({ where: { publicacionId: Number(req.params.id) } });
      if (keywords) {
        const kwArray = typeof keywords === "string"
          ? JSON.parse(keywords)
          : (Array.isArray(keywords) ? keywords : []);
        await PublicacionKeyword.bulkCreate(
          kwArray.map((nombre: string) => ({
            nombre,
            publicacionId: Number(req.params.id),
          }))
        );
      }
    }

    const publicacionConRelaciones = await Publicacion.findByPk(Number(req.params.id), {
      include: [
        {
          model: Investigador,
          as: "investigadores",
          through: { attributes: [] },
        },
        {
          model: LineaInvestigacion,
          as: "lineas",
          through: { attributes: [] },
        },
        {
          model: PublicacionKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.json({ success: true, data: mapPublicacion(publicacionConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la publicación",
      error,
    });
  }
};

export const deletePublicacion = async (req: Request, res: Response) => {
  try {
    const publicacion = await Publicacion.findByPk(Number(req.params.id));

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        message: "Publicación no encontrada",
      });
    }

    await publicacion.destroy();

    return res.json({ success: true, message: "Publicación eliminada" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo eliminar la publicación",
      error,
    });
  }
};
