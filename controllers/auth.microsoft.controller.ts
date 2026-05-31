import { Request, Response } from "express";
import { Op } from "sequelize";
import crypto from "crypto";
import { ConfidentialClientApplication, PublicClientApplication, Configuration } from "@azure/msal-node";
import { Usuario, Investigador, GrupoInformacion } from "../models";
import { generateToken } from "../utils/jwt";
import { hashPassword } from "../utils/bcrypt";

let ccaInstance: ConfidentialClientApplication | PublicClientApplication | null = null;

const getMsalInstance = (): ConfidentialClientApplication | PublicClientApplication => {
  if (ccaInstance) return ccaInstance;

  const secret = process.env.MICROSOFT_CLIENT_SECRET;
  const hasSecret = secret && secret !== "YOUR_CLIENT_SECRET_HERE" && secret.trim() !== "";

  const msalConfig: Configuration = {
    auth: {
      clientId: process.env.MICROSOFT_CLIENT_ID || "696c1fe3-f3eb-46da-b758-3f5f54ba7839",
      authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || "a988ccd4-00ed-4bf3-a4d1-b5661f44abdf"}`,
    }
  };

  if (hasSecret) {
    msalConfig.auth.clientSecret = secret;
    ccaInstance = new ConfidentialClientApplication(msalConfig);
    console.log("MSAL inicializado en modo Cliente Confidencial.");
  } else {
    ccaInstance = new PublicClientApplication(msalConfig);
    console.log("MSAL inicializado en modo Cliente Público.");
  }

  return ccaInstance;
};

export const microsoftLogin = async (req: Request, res: Response) => {
  const authCodeUrlParameters = {
    scopes: ["user.read", "openid", "profile", "email"],
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || "http://localhost:3000/auth/microsoft/callback",
  };

  try {
    const cca = getMsalInstance();
    const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);
    return res.redirect(authUrl);
  } catch (error: any) {
    console.error("Error generating Microsoft login URL:", error);
    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión con Microsoft",
    });
  }
};

export const microsoftCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  const tokenRequest = {
    code: code,
    scopes: ["user.read", "openid", "profile", "email"],
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || "http://localhost:3000/auth/microsoft/callback",
  };

  try {
    const cca = getMsalInstance();
    const tokenResponse = await cca.acquireTokenByCode(tokenRequest);
    const claims = tokenResponse.idTokenClaims as any;

    if (!claims) {
      return res.redirect(`${frontendUrl}/login?error=invalid_token`);
    }

    const email = (claims.email || claims.preferred_username || "").toLowerCase().trim();
    const nombre = claims.name || claims.preferred_username || "Usuario Microsoft";
    const oid = claims.oid;

    if (!email) {
      return res.redirect(`${frontendUrl}/login?error=email_not_provided`);
    }

    // 1. Search if the user exists
    let usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { microsoft_oid: oid },
          { correo: email }
        ]
      }
    });

    if (usuario) {
      // Link the account if it is not linked yet
      if (!usuario.get("microsoft_oid")) {
        await usuario.update({ microsoft_oid: oid });
      }
    } else {
      // 2. Validate institutional registration
      const isInstitutional = email.endsWith("@uta.edu.ec");
      const isReasons = email === "reasons@uta.edu.ec";

      const investigador = await Investigador.findOne({ where: { correo: email } });
      const grupo = await GrupoInformacion.findOne({ where: { correo: email } });

      const isAuthorized = isInstitutional && (investigador || isReasons || grupo);

      if (!isAuthorized) {
        return res.redirect(`${frontendUrl}/login?error=not_authorized&email=${encodeURIComponent(email)}`);
      }

      // Create a random secure password because the schema requires it
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      usuario = await Usuario.create({
        nombre,
        correo: email,
        password: hashedPassword,
        microsoft_oid: oid,
        rol: "admin",
      });
    }

    // 3. Generate JWT
    const token = generateToken({
      id: usuario.get("id") as number,
      correo: usuario.get("correo") as string,
      rol: usuario.get("rol") as string,
    });

    const plainUser = usuario.get({ plain: true }) as any;
    delete plainUser.password;

    return res.redirect(
      `${frontendUrl}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(plainUser))}`
    );
  } catch (error) {
    console.error("Error during Microsoft auth callback:", error);
    return res.redirect(`${frontendUrl}/login?error=microsoft_auth_failed`);
  }
};
