import bcryptjs from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10);

/**
 * Hash una contraseña con bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

/**
 * Comparar una contraseña con su hash
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcryptjs.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};
