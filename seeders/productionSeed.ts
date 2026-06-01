import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "../config/database";
import { resetSequences } from "../utils/db";
import {
  GrupoInformacion,
  LineaInvestigacion,
  Usuario,
  GrupoObjetivo,
} from "../models";
import { hashPassword } from "../utils/bcrypt";

const DEFAULT_LOGO = "/uploads/defaults/defaultLogo.png";

async function seedProduction(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos correcta para seeder de producción");

    // =========================
    // USUARIO ADMIN
    // =========================
    const adminCorreo = "admin@reasons.com";
    const existingAdmin = await Usuario.findOne({
      where: { correo: adminCorreo },
    });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");

      await Usuario.create({
        nombre: "Administrador",
        correo: adminCorreo,
        password: hashedPassword,
        rol: "admin",
      });
      console.log("Admin creado exitosamente");
    } else {
      console.log("El usuario Admin ya existe, omitiendo creación");
    }

    // =========================
    // GRUPO DE INVESTIGACIÓN
    // =========================
    await GrupoInformacion.upsert({
      id: 1,
      nombre:
        "REASONS (Research in Engineering and Advanced Sustainable Operations, Nature, and Society)",
      descripcion:
        "REASONS (Research in Engineering and Advanced Sustainable Operations, Nature, and Society) es un grupo de investigación de la Universidad Técnica de Ambato que impulsa soluciones innovadoras en ingeniería con un enfoque de sostenibilidad y compromiso social. Sus líneas de trabajo abarcan operaciones industriales, tecnologías limpias, gestión eficiente de recursos, innovación social y el diseño de sistemas resilientes frente al cambio climático. El grupo busca generar conocimiento científico y aplicado que contribuya al desarrollo sostenible, fortaleciendo la vinculación entre academia, industria, comunidad y naturaleza. Además, promueve la formación de talento humano en ingeniería con visión ética y ambiental, orientado a responder a los desafíos locales y globales. Su propósito es consolidarse como un referente que conecta ciencia, sociedad y naturaleza en la construcción de un futuro sostenible.",
      objetivoGeneral:
        "Desarrollar investigación aplicada e interdisciplinaria en el campo de la ingeniería para promover operaciones que integren la preservación de la naturaleza, la innovación tecnológica y el bienestar de la sociedad.",
      dominio:
        "Optimización de los Sistemas Productivos, Diseño y Desarrollo Urbanístico de la Facultad de Ingeniería en Sistemas, Electrónica e Industrial.",
      direccion:
        "Av. de Los Chasquis y Av. Río Payamino. Facultad de Ingeniería en Sistemas, Electrónica e Industrial. Universidad Técnica de Ambato. Ambato – Ecuador.",
      correo: "reasons@uta.edu.ec",
      logo: DEFAULT_LOGO,
      metodologia: "Nuestra metodología se basa en un enfoque interdisciplinario que combina el modelado analítico, la optimización de procesos industriales, el análisis de ciclo de vida de los materiales y la recopilación de datos microclimáticos en tiempo real.",
      portada: "/uploads/defaults/defaultProyecto.png",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      mainColor: "#006633",
      miniLogo: "/Logo_sin_fondo.png",
    });
    console.log("Información del grupo REASONS creada/actualizada");

    // Seed specific objectives of the group
    await GrupoObjetivo.destroy({ where: { grupoId: 1 } });
    const grupoObjetivos = [
      "1. Diseñar y optimizar procesos orientados a la eficiencia, el uso responsable de recursos y la reducción de impactos ambientales.",
      "2. Generar proyectos de investigación y vinculación que fortalezcan la relación entre academia, industria y comunidades, aportando soluciones sostenibles a problemáticas locales y globales.",
      "3. Formar profesionales e investigadores en ingeniería con visión ética, ambiental y social, capaces de liderar iniciativas que impulsen el desarrollo sostenible."
    ];
    await GrupoObjetivo.bulkCreate(
      grupoObjetivos.map(descripcion => ({
        descripcion,
        grupoId: 1,
      }))
    );
    console.log("Objetivos del grupo creados exitosamente");

    // =========================
    // LÍNEAS DE INVESTIGACIÓN
    // =========================
    const lineas = [
      {
        id: 1,
        nombre:
          "Diseño, Materiales, Producción, Identidad, Sostenibilidad y Tecnologías aplicadas",
        descripcion:
          "Esta línea de investigación aborda el diseño, los materiales y los sistemas productivos desde un enfoque sostenible, integrando tecnologías aplicadas e identidad territorial. Su objetivo es mejorar la eficiencia de los procesos, optimizar el uso de recursos y promover soluciones innovadoras en entornos industriales.",
      },
      {
        id: 2,
        nombre: "Software, Tecnologías de la Información y Ciencias de Datos",
        descripcion:
          "Esta línea aborda el uso de software, tecnologías de la información y ciencias de datos para apoyar la toma de decisiones y optimizar procesos en entornos productivos, mediante analítica, modelado y herramientas digitales.",
      },
      {
        id: 3,
        nombre: "Energía, Desarrollo Sostenible y Gestión de Recursos Naturales",
        descripcion:
          "Esta línea aborda la energía, el desarrollo sostenible y la gestión de recursos naturales, promoviendo el uso eficiente de los recursos y la implementación de soluciones tecnológicas que favorezcan la sostenibilidad ambiental y productiva.",
      },
    ];

    for (const linea of lineas) {
      await LineaInvestigacion.upsert(linea);
    }
    console.log("Líneas de investigación creadas/actualizadas");

    await resetSequences(sequelize);
    console.log("Seeder de producción completado correctamente");
    return true;
  } catch (error) {
    console.error("Error al ejecutar el seeder de producción:", error);
    throw error;
  }
}

export default seedProduction;
