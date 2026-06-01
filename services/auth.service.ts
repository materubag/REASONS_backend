import { Usuario } from "../models";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";

interface LoginPayload {
  correo: string;
  password: string;
}

interface RegisterPayload {
  nombre: string;
  correo: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: Record<string, any>;
  token?: string;
}

/**
 * Construir objeto de usuario sin password
 */
const buildUserPayload = (user: Usuario) => {
  const plainUser = user.get({ plain: true }) as Record<string, unknown>;
  delete plainUser.password;
  return plainUser;
};

/**
 * Login de usuario
 */
export const loginService = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  try {
    const { correo, password } = payload;

    // Validar que existan los campos requeridos
    if (!correo || !password) {
      return {
        success: false,
        message: "Correo y contraseña son requeridos",
      };
    }

    // Buscar usuario por correo
    const user = await Usuario.findOne({ where: { correo } });

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    // Comparar contraseña
    const isPasswordValid = await comparePassword(
      password,
      user.get("password") as string
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Contraseña incorrecta",
      };
    }

    // Generar token
    const userData = buildUserPayload(user);
    const token = generateToken({
      id: user.get("id") as number,
      correo: user.get("correo") as string,
      rol: user.get("rol") as string,
    });

    return {
      success: true,
      message: "Login exitoso",
      user: userData,
      token,
    };
  } catch (error) {
    console.error("Error in loginService:", error);
    return {
      success: false,
      message: "Error en el proceso de login",
    };
  }
};

/**
 * Registrar nuevo usuario
 */
export const registerService = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  try {
    const { nombre, correo, password } = payload;

    // Validar que existan los campos requeridos
    if (!nombre || !correo || !password) {
      return {
        success: false,
        message: "Nombre, correo y contraseña son requeridos",
      };
    }

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { correo } });

    if (existingUser) {
      return {
        success: false,
        message: "El correo ya está registrado",
      };
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear nuevo usuario
    const newUser = await Usuario.create({
      nombre,
      correo,
      password: hashedPassword,
    });

    // Generar token
    const userData = buildUserPayload(newUser);
    const token = generateToken({
      id: newUser.get("id") as number,
      correo: newUser.get("correo") as string,
      rol: newUser.get("rol") as string,
    });

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      user: userData,
      token,
    };
  } catch (error) {
    console.error("Error in registerService:", error);
    return {
      success: false,
      message: "Error en el proceso de registro",
    };
  }
};

/**
 * Validar token JWT
 */
export const validateTokenService = async (token: string): Promise<boolean> => {
  const decoded = verifyToken(token);
  return decoded !== null;
};

/**
 * Obtener información del usuario del token
 */
export const getUserFromTokenService = async (token: string) => {
  return verifyToken(token);
};

/**
 * Cambiar contraseña de usuario
 */
export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<AuthResponse> => {
  try {
    // Validar que existan los campos requeridos
    if (!oldPassword || !newPassword) {
      return {
        success: false,
        message: "Contraseña anterior y nueva son requeridas",
      };
    }

    // Buscar usuario
    const user = await Usuario.findByPk(userId);

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    // Comparar contraseña anterior
    const isPasswordValid = await comparePassword(
      oldPassword,
      user.get("password") as string
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Contraseña anterior incorrecta",
      };
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hashPassword(newPassword);

    // Actualizar contraseña
    await user.update({ password: hashedPassword });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error in changePasswordService:", error);
    return {
      success: false,
      message: "Error al cambiar la contraseña",
    };
  }
};
