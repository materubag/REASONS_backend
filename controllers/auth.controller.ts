import { Request, Response } from "express";
import { loginService, registerService } from "../services/auth.service";
import { calculatePagination, buildPaginationMeta } from "../utils/pagination";
import { Usuario } from "../models";

const buildUserPayload = (user: Usuario) => {
	const plainUser = user.get({ plain: true }) as Record<string, unknown>;
	delete plainUser.password;
	return plainUser;
};

export const register = async (req: Request, res: Response) => {
	try {
		const result = await registerService(req.body);

		if (!result.success) {
			const statusCode = result.message.includes("ya está registrado") ? 409 : 400;
			return res.status(statusCode).json({
				success: false,
				message: result.message,
			});
		}

		return res.status(201).json({
			success: true,
			data: result.user,
			token: result.token,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo registrar el usuario",
			error,
		});
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const result = await loginService(req.body);

		if (!result.success) {
			return res.status(401).json({
				success: false,
				message: result.message,
			});
		}

		return res.json({
			success: true,
			message: result.message,
			data: result.user,
			token: result.token,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudo iniciar sesión",
			error,
		});
	}
};

export const listUsers = async (req: Request, res: Response) => {
	try {
		const { limit, offset, page } = calculatePagination(req.query);
		const { count, rows } = await Usuario.findAndCountAll({
			order: [["id", "ASC"]],
			limit,
			offset,
		});

		return res.json({
			success: true,
			data: rows.map(buildUserPayload),
			meta: buildPaginationMeta(page, limit, count),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "No se pudieron obtener los usuarios",
			error,
		});
	}
};

