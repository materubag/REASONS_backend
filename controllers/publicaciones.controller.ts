import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Publicacion } from "../models";

export const getPublicaciones = async (req: Request, res: Response) => {
	try {
		const { limit, offset, page } = calculatePagination(req.query);
		const { count, rows } = await Publicacion.findAndCountAll({
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
			message: "No se pudieron obtener las publicaciones",
			error,
		});
	}
};

export const getPublicacionById = async (req: Request, res: Response) => {
	try {
		const publicacion = await Publicacion.findByPk(Number(req.params.id));

		if (!publicacion) {
			return res.status(404).json({
				success: false,
				message: "Publicación no encontrada",
			});
		}

		return res.json({ success: true, data: publicacion });
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
		const publicacion = await Publicacion.create(req.body);

		return res.status(201).json({ success: true, data: publicacion });
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

		await publicacion.update(req.body);

		return res.json({ success: true, data: publicacion });
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

		await publicacion.update(req.body);

		return res.json({ success: true, data: publicacion });
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

