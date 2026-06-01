import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Investigador } from "../models";

export const getInvestigadores = async (req: Request, res: Response) => {
	try {
		const { limit, offset, page } = calculatePagination(req.query, 20);
		const { count, rows } = await Investigador.findAndCountAll({
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
			message: "No se pudieron obtener los investigadores",
			error,
		});
	}
};

export const getInvestigadorById = async (req: Request, res: Response) => {
	try {
		const investigador = await Investigador.findByPk(Number(req.params.id));

		if (!investigador) {
			return res.status(404).json({
				success: false,
				message: "Investigador no encontrado",
			});
		}

		return res.json({ success: true, data: investigador });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo obtener el investigador",
			error,
		});
	}
};

export const createInvestigador = async (req: Request, res: Response) => {
	try {
		if (req.body.cargo === "Director" || req.body.cargo === "Subdirector") {
			const existing = await Investigador.findOne({ where: { cargo: req.body.cargo } });
			if (existing) {
				return res.status(400).json({
					success: false,
					message: `Ya existe un ${req.body.cargo.toLowerCase()} registrado en el sistema. Solo se permite uno.`,
				});
			}
		}

		const investigador = await Investigador.create(req.body);

		return res.status(201).json({ success: true, data: investigador });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo crear el investigador",
			error,
		});
	}
};

export const updateInvestigador = async (req: Request, res: Response) => {
	try {
		const investigador = await Investigador.findByPk(Number(req.params.id));

		if (!investigador) {
			return res.status(404).json({
				success: false,
				message: "Investigador no encontrado",
			});
		}

		if (req.body.cargo === "Director" || req.body.cargo === "Subdirector") {
			const existing = await Investigador.findOne({ where: { cargo: req.body.cargo } });
			if (existing && existing.id !== Number(req.params.id)) {
				return res.status(400).json({
					success: false,
					message: `Ya existe un ${req.body.cargo.toLowerCase()} registrado en el sistema. Solo se permite uno.`,
				});
			}
		}

		await investigador.update(req.body);

		return res.json({ success: true, data: investigador });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo actualizar el investigador",
			error,
		});
	}
};

export const patchInvestigador = async (req: Request, res: Response) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({
				success: false,
				message: "No se proporcionaron campos para actualizar",
			});
		}

		const investigador = await Investigador.findByPk(Number(req.params.id));

		if (!investigador) {
			return res.status(404).json({
				success: false,
				message: "Investigador no encontrado",
			});
		}

		if (req.body.cargo === "Director" || req.body.cargo === "Subdirector") {
			const existing = await Investigador.findOne({ where: { cargo: req.body.cargo } });
			if (existing && existing.id !== Number(req.params.id)) {
				return res.status(400).json({
					success: false,
					message: `Ya existe un ${req.body.cargo.toLowerCase()} registrado en el sistema. Solo se permite uno.`,
				});
			}
		}

		await investigador.update(req.body);

		return res.json({ success: true, data: investigador });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo actualizar el investigador",
			error,
		});
	}
};

export const deleteInvestigador = async (req: Request, res: Response) => {
	try {
		const investigador = await Investigador.findByPk(Number(req.params.id));

		if (!investigador) {
			return res.status(404).json({
				success: false,
				message: "Investigador no encontrado",
			});
		}

		await investigador.destroy();

		return res.json({ success: true, message: "Investigador eliminado" });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo eliminar el investigador",
			error,
		});
	}
};

