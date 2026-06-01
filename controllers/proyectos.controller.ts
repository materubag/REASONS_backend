import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Proyecto, Investigador, LineaInvestigacion, ProyectoObjetivo, ProyectoKeyword } from "../models";

// Helper to map and maintain 100% backward compatibility with the frontend
const mapProyecto = (proyecto: any) => {
  if (!proyecto) return null;
  const plain = proyecto.toJSON ? proyecto.toJSON() : proyecto;

  // Reconstruct "objetivos" as a single string joined by newlines
  if (plain.objetivosList) {
    plain.objetivos = plain.objetivosList.map((o: any) => o.descripcion).join('\n');
    delete plain.objetivosList;
  } else if (!plain.objetivos) {
    plain.objetivos = "";
  }

  // Reconstruct "keywords" as an array of strings
  if (plain.keywordsList) {
    plain.keywords = plain.keywordsList.map((k: any) => k.nombre);
    delete plain.keywordsList;
  } else if (!plain.keywords) {
    plain.keywords = [];
  }

  return plain;
};

export const getProyectos = async (req: Request, res: Response) => {
  try {
    const { limit, offset, page } = calculatePagination(req.query);
    const { count, rows } = await Proyecto.findAndCountAll({
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
          model: ProyectoObjetivo,
          as: "objetivosList",
        },
        {
          model: ProyectoKeyword,
          as: "keywordsList",
        },
      ],
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    const mappedRows = rows.map(row => mapProyecto(row));

    return res.json({
      success: true,
      data: mappedRows,
      meta: buildPaginationMeta(page, limit, count),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudieron obtener los proyectos",
      error,
    });
  }
};

export const getProyectoById = async (req: Request, res: Response) => {
  try {
    const proyecto = await Proyecto.findByPk(Number(req.params.id), {
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
          model: ProyectoObjetivo,
          as: "objetivosList",
        },
        {
          model: ProyectoKeyword,
          as: "keywordsList",
        },
      ],
    });

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    return res.json({ success: true, data: mapProyecto(proyecto) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo obtener el proyecto",
      error,
    });
  }
};

export const createProyecto = async (req: Request, res: Response) => {
  try {
    const { investigadores, lineas, objetivos, keywords, ...proyectoData } = req.body;

    // Límite de seguridad: 10MB máximo por campo de texto enriquecido
    const maxByteLimit = 10 * 1024 * 1024;
    if (
      Buffer.byteLength(proyectoData.descripcionExtendida || "", "utf8") > maxByteLimit ||
      Buffer.byteLength(proyectoData.resultados || "", "utf8") > maxByteLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "El tamaño del contenido (Descripción Extendida o Resultados) supera el límite máximo permitido de 10MB.",
      });
    }

    if (proyectoData.fechaInicio && proyectoData.fechaFin) {
      if (new Date(proyectoData.fechaFin) < new Date(proyectoData.fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
      }
    }

    const proyecto = await Proyecto.create(proyectoData);

    if (investigadores && investigadores.length > 0) {
      await (proyecto as any).setInvestigadores(investigadores);
    }
    if (lineas && lineas.length > 0) {
      await (proyecto as any).setLineas(lineas);
    }

    // Save objectives into the ProyectoObjetivo table
    if (objetivos) {
      const objArray = typeof objetivos === "string"
        ? objetivos.split('\n').map(o => o.trim()).filter(Boolean)
        : (Array.isArray(objetivos) ? objetivos : []);
      await ProyectoObjetivo.bulkCreate(
        objArray.map((descripcion: string) => ({
          descripcion,
          proyectoId: (proyecto as any).id,
        }))
      );
    }

    // Save keywords into the ProyectoKeyword table
    if (keywords) {
      const kwArray = typeof keywords === "string"
        ? JSON.parse(keywords)
        : (Array.isArray(keywords) ? keywords : []);
      await ProyectoKeyword.bulkCreate(
        kwArray.map((nombre: string) => ({
          nombre,
          proyectoId: (proyecto as any).id,
        }))
      );
    }

    const proyectoConRelaciones = await Proyecto.findByPk((proyecto as any).id, {
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
          model: ProyectoObjetivo,
          as: "objetivosList",
        },
        {
          model: ProyectoKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.status(201).json({ success: true, data: mapProyecto(proyectoConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo crear el proyecto",
      error,
    });
  }
};

export const updateProyecto = async (req: Request, res: Response) => {
  try {
    const proyecto = await Proyecto.findByPk(Number(req.params.id));

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    const { investigadores, lineas, objetivos, keywords, ...proyectoData } = req.body;

    // Límite de seguridad: 10MB máximo por campo de texto enriquecido
    const maxByteLimit = 10 * 1024 * 1024;
    if (
      Buffer.byteLength(proyectoData.descripcionExtendida || "", "utf8") > maxByteLimit ||
      Buffer.byteLength(proyectoData.resultados || "", "utf8") > maxByteLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "El tamaño del contenido (Descripción Extendida o Resultados) supera el límite máximo permitido de 10MB.",
      });
    }

    const fechaInicio = proyectoData.fechaInicio !== undefined ? proyectoData.fechaInicio : (proyecto as any).fechaInicio;
    const fechaFin = proyectoData.fechaFin !== undefined ? proyectoData.fechaFin : (proyecto as any).fechaFin;

    if (fechaInicio && fechaFin) {
      if (new Date(fechaFin) < new Date(fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
      }
    }

    await proyecto.update(proyectoData);

    if (investigadores !== undefined) {
      await (proyecto as any).setInvestigadores(investigadores);
    }
    if (lineas !== undefined) {
      await (proyecto as any).setLineas(lineas);
    }

    // Update objectives: delete existing and bulkCreate new
    if (objetivos !== undefined) {
      await ProyectoObjetivo.destroy({ where: { proyectoId: Number(req.params.id) } });
      if (objetivos) {
        const objArray = typeof objetivos === "string"
          ? objetivos.split('\n').map(o => o.trim()).filter(Boolean)
          : (Array.isArray(objetivos) ? objetivos : []);
        await ProyectoObjetivo.bulkCreate(
          objArray.map((descripcion: string) => ({
            descripcion,
            proyectoId: Number(req.params.id),
          }))
        );
      }
    }

    // Update keywords: delete existing and bulkCreate new
    if (keywords !== undefined) {
      await ProyectoKeyword.destroy({ where: { proyectoId: Number(req.params.id) } });
      if (keywords) {
        const kwArray = typeof keywords === "string"
          ? JSON.parse(keywords)
          : (Array.isArray(keywords) ? keywords : []);
        await ProyectoKeyword.bulkCreate(
          kwArray.map((nombre: string) => ({
            nombre,
            proyectoId: Number(req.params.id),
          }))
        );
      }
    }

    const proyectoConRelaciones = await Proyecto.findByPk(Number(req.params.id), {
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
          model: ProyectoObjetivo,
          as: "objetivosList",
        },
        {
          model: ProyectoKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.json({ success: true, data: mapProyecto(proyectoConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar el proyecto",
      error,
    });
  }
};

export const patchProyecto = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron campos para actualizar",
      });
    }

    const proyecto = await Proyecto.findByPk(Number(req.params.id));

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    const { investigadores, lineas, objetivos, keywords, ...proyectoData } = req.body;

    // Límite de seguridad: 10MB máximo por campo de texto enriquecido
    const maxByteLimit = 10 * 1024 * 1024;
    if (
      Buffer.byteLength(proyectoData.descripcionExtendida || "", "utf8") > maxByteLimit ||
      Buffer.byteLength(proyectoData.resultados || "", "utf8") > maxByteLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "El tamaño del contenido (Descripción Extendida o Resultados) supera el límite máximo permitido de 10MB.",
      });
    }

    const fechaInicio = proyectoData.fechaInicio !== undefined ? proyectoData.fechaInicio : (proyecto as any).fechaInicio;
    const fechaFin = proyectoData.fechaFin !== undefined ? proyectoData.fechaFin : (proyecto as any).fechaFin;

    if (fechaInicio && fechaFin) {
      if (new Date(fechaFin) < new Date(fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
      }
    }

    await proyecto.update(proyectoData);

    if (investigadores !== undefined) {
      await (proyecto as any).setInvestigadores(investigadores);
    }
    if (lineas !== undefined) {
      await (proyecto as any).setLineas(lineas);
    }

    // Update objectives: delete existing and bulkCreate new
    if (objetivos !== undefined) {
      await ProyectoObjetivo.destroy({ where: { proyectoId: Number(req.params.id) } });
      if (objetivos) {
        const objArray = typeof objetivos === "string"
          ? objetivos.split('\n').map(o => o.trim()).filter(Boolean)
          : (Array.isArray(objetivos) ? objetivos : []);
        await ProyectoObjetivo.bulkCreate(
          objArray.map((descripcion: string) => ({
            descripcion,
            proyectoId: Number(req.params.id),
          }))
        );
      }
    }

    // Update keywords: delete existing and bulkCreate new
    if (keywords !== undefined) {
      await ProyectoKeyword.destroy({ where: { proyectoId: Number(req.params.id) } });
      if (keywords) {
        const kwArray = typeof keywords === "string"
          ? JSON.parse(keywords)
          : (Array.isArray(keywords) ? keywords : []);
        await ProyectoKeyword.bulkCreate(
          kwArray.map((nombre: string) => ({
            nombre,
            proyectoId: Number(req.params.id),
          }))
        );
      }
    }

    const proyectoConRelaciones = await Proyecto.findByPk(Number(req.params.id), {
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
          model: ProyectoObjetivo,
          as: "objetivosList",
        },
        {
          model: ProyectoKeyword,
          as: "keywordsList",
        },
      ],
    });

    return res.json({ success: true, data: mapProyecto(proyectoConRelaciones) });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar el proyecto",
      error,
    });
  }
};

export const deleteProyecto = async (req: Request, res: Response) => {
  try {
    const proyecto = await Proyecto.findByPk(Number(req.params.id));

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    await proyecto.destroy();

    return res.json({ success: true, message: "Proyecto eliminado" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo eliminar el proyecto",
      error,
    });
  }
};
