import { Request, Response } from "express";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Contacto } from "../models";

export const getContactos = async (req: Request, res: Response) => {
	try {
		const { limit, offset, page } = calculatePagination(req.query);
		const { count, rows } = await Contacto.findAndCountAll({
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
			message: "No se pudieron obtener los contactos",
			error,
		});
	}
};

export const getContactoById = async (req: Request, res: Response) => {
	try {
		const contacto = await Contacto.findByPk(Number(req.params.id));

		if (!contacto) {
			return res.status(404).json({
				success: false,
				message: "Contacto no encontrado",
			});
		}

		return res.json({ success: true, data: contacto });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo obtener el contacto",
			error,
		});
	}
};

export const createContacto = async (req: Request, res: Response) => {
	try {
		const { nombre, correo, mensaje } = req.body;

		if (!nombre || !correo || !mensaje) {
			return res.status(400).json({
				success: false,
				message: "nombre, correo y mensaje son requeridos",
			});
		}

		const contacto = await Contacto.create({ nombre, correo, mensaje });

		return res.status(201).json({ success: true, data: contacto });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo crear el contacto",
			error,
		});
	}
};

export const deleteContacto = async (req: Request, res: Response) => {
	try {
		const contacto = await Contacto.findByPk(Number(req.params.id));

		if (!contacto) {
			return res.status(404).json({
				success: false,
				message: "Contacto no encontrado",
			});
		}

		await contacto.destroy();

		return res.json({ success: true, message: "Contacto eliminado" });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo eliminar el contacto",
			error,
		});
	}
};

