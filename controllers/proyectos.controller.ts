import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Proyecto } from "../models";

export const getProyectos = async (req: Request, res: Response) => {
	try {
		const { limit, offset, page } = calculatePagination(req.query);
		const { count, rows } = await Proyecto.findAndCountAll({
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
			message: "No se pudieron obtener los proyectos",
			error,
		});
	}
};

export const getProyectoById = async (req: Request, res: Response) => {
	try {
		const proyecto = await Proyecto.findByPk(Number(req.params.id));

		if (!proyecto) {
			return res.status(404).json({
				success: false,
				message: "Proyecto no encontrado",
			});
		}

		return res.json({ success: true, data: proyecto });
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
		const proyecto = await Proyecto.create(req.body);

		return res.status(201).json({ success: true, data: proyecto });
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

		await proyecto.update(req.body);

		return res.json({ success: true, data: proyecto });
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

		await proyecto.update(req.body);

		return res.json({ success: true, data: proyecto });
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

