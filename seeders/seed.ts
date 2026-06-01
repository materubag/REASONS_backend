import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "../config/database";
import { resetSequences } from "../utils/db";
import {
  GrupoInformacion,
  Investigador,
  LineaInvestigacion,
  Usuario,
  Proyecto,
  Publicacion,
  GrupoObjetivo,
  ProyectoObjetivo,
  ProyectoKeyword,
  PublicacionKeyword,
} from "../models";
import { hashPassword } from "../utils/bcrypt";

const DEFAULT_FOTO = "/uploads/defaults/defaultFoto.png";
const DEFAULT_LOGO = "/uploads/defaults/defaultLogo.png";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos correcta");

    await sequelize.sync({ alter: true });

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

    // =========================
    // INVESTIGADORES
    // =========================
    const investigadores = [
      {
        id: 1,
        nombre: "Israel Naranjo Chiriboga",
        orcid: "https://orcid.org/0000-0001-5774-1879",
        correo: "ie.naranjo@uta.edu.ec",
        biografia:
          "Docente universitario en la carrera de Ingeniería Industrial en la Universidad Técnica de Ambato (UTA). Magíster en Gestión de Operaciones por la UTA y estudiante del Programa de Doctorado en Ingeniería y Producción Industrial en la Universitat Politècnica de València. Director del Grupo de Investigación REASONS (Research in Engineering and Advanced Sustainable Operations, Nature, and Society). Su investigación se centra en la toma de decisiones sostenibles en entornos productivos, con énfasis en PYMES del sector textil. Sus líneas de trabajo incluyen la gestión de la cadena de suministro, el análisis de datos, la optimización y la mejora de sistemas productivos mediante el uso de herramientas de ingeniería.",
        cargo: "Director",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 2,
        nombre: "Franklin Tigre Ortega",
        orcid: "https://orcid.org/0000-0003-0254-029X",
        correo: "fg.tigre@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Subdirector",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 3,
        nombre: "John Reyes Vásquez",
        orcid: "http://orcid.org/0000-0002-5446-5490",
        correo: "johnpreyes@uta.edu.ec",
        biografia:
          "Es Doctor en Ingeniería y Producción Industrial por la Universitat Politècnica de València. Actualmente es profesor e investigador en la Universidad Técnica de Ambato, Universidad de las Américas, entre otras. Ha sido consultor para empresas mineras y de calzado, donde ha participado en procesos logísticos, operativos y de gestión, así como en el área de análisis de riesgos. Sus intereses de investigación incluyen las tecnologías de la información, producción industrial, gestión de la cadena de suministro, investigación de operaciones, herramientas de fabricación ajustada, gestión de procesos empresariales, la modelización y la simulación, todo ello en el contexto de la industria 4.0/5.0.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: "https://www.linkedin.com/in/john-reyes-b44148150/",
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 4,
        nombre: "Carlos Sánchez Rosero",
        orcid: "https://orcid.org/0000-0002-2253-8448",
        correo: "carloshsanchez@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 5,
        nombre: "Luis Morales Perrazo",
        orcid: "https://orcid.org/0000-0002-0921-262X",
        correo: "luisamorales@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 6,
        nombre: "Freddy Lema Chicaiza",
        orcid: "https://orcid.org/my-orcid?orcid=0000-0001-5987-8975",
        correo: "fr.lema@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 7,
        nombre: "Edgar Patricio Córdova Córdova",
        orcid: "https://orcid.org/0000-0002-2866-287X",
        correo: "edgarpcordovac@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 8,
        nombre: "Christian Mariño Rivera",
        orcid: "https://orcid.org/0000-0001-7039-8235",
        correo: "christianjmarino@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 9,
        nombre: "Ana Pamela Castro Martin",
        orcid: "https://orcid.org/0000-0002-7954-7871",
        correo: "ap.castro@uta.edu.ec",
        biografia:
          "Docente universitaria en las carreras de Ingeniería en Telecomunicaciones e Ingeniería en Automatización y Robótica. Posee el grado de Maestra en Sistemas de Manufactura y el título de Ingeniera Mecatrónica, con trayectoria consolidada en docencia universitaria, investigación científica y ejercicio profesional en el sector industrial. Su labor investigativa se orienta al estudio y desarrollo de la conectividad de máquinas y procesos en el contexto de la Industria 4.0 y 5.0, así como al diseño e implementación de sistemas inteligentes basados en el Internet de las Cosas (IoT). En el ámbito profesional, ha participado en el diseño de componentes mecánicos, automatización de procesos industriales y programación de plataformas electrónicas, contribuyendo al desarrollo de soluciones tecnológicas innovadoras.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 10,
        nombre: "Daysi Ortiz Guerrero",
        orcid: "https://orcid.org/0000-0001-6485-808X",
        correo: "dm.ortiz@uta.edu.ec",
        biografia:
          "Docente universitaria en la carrera de Ingeniería Industrial de la Universidad Técnica de Ambato. Ingeniera Industrial en Procesos de Automatización y Magíster en Gestión de Operaciones por la misma institución. Estudiante del Programa de Doctorado en Ingeniería y Producción Industrial en la Universitat Politècnica de València e investigadora del Grupo de Investigación REASONS (Research in Engineering and Advanced Sustainable Operations, Nature, and Society). Presenta experiencia profesional en planificación de la producción y gestión de procesos en empresas del sector manufacturero y de servicios. Su labor académica se orienta hacia la optimización de procesos, la mejora continua, la eficiencia operativa y la manufactura esbelta. Su línea de investigación doctoral se centra en la integración de la sostenibilidad en la planificación de la producción, con énfasis en el desempeño eficiente de sistemas productivos.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
      {
        id: 11,
        nombre: "César Rosero Mantilla",
        orcid: "https://orcid.org/0000-0001-7806-2955",
        correo: "cesararosero@uta.edu.ec",
        biografia:
          "Incluye títulos, cargos actuales y anteriores, experiencia profesional, investigación y vinculación.",
        cargo: "Investigador",
        foto: DEFAULT_FOTO,
        linkedin: null,
        facebook: null,
        instagram: null,
        telegram: null,
      },
    ];

    for (const investigador of investigadores) {
      await Investigador.upsert(investigador);
    }

    // =========================
    // PROYECTOS Y PUBLICACIONES SEED
    // =========================
    console.log("Seedeando Proyectos y Publicaciones...");

    const proyectos = [
      {
        id: 1,
        titulo: "Urban Heat Island Mitigation Strategies",
        descripcion: "This longitudinal study investigates the efficacy of integrated green infrastructure in high-density urban corridors. By deploying a network of micro-climate sensors across three metropolitan areas, we are developing predictive models to assess cooling potential.",
        resultados: "Initial data indicates a 2.4°C average reduction in ambient temperature within 50 meters of high-density green roofing installations during peak summer months.",
        imagen: "/uploads/proyectos/default.png",
        fechaInicio: "2023-01-15",
        fechaFin: "2025-12-31",
        objetivosSeed: [
          "1. Quantify surface temperature variance",
          "2. Model airflow impedance of varying vegetation",
          "3. Develop actionable zoning guidelines"
        ],
        keywordsSeed: ["Sustainability", "Urban Heat", "Green Infrastructure"]
      },
      {
        id: 2,
        titulo: "Proyecto de Prueba Sin Imagen Opcional",
        descripcion: "Este es un proyecto secundario de prueba diseñado para validar el comportamiento del frontend cuando no se especifica una imagen. El contenedor de imagen debe ocultarse por completo y este bloque de texto debe expandirse al 100% de la pantalla de forma fluida y elegante.",
        resultados: "Se validó exitosamente la adaptabilidad visual de la rejilla y los detalles de los proyectos sin recursos gráficos vinculados.",
        imagen: null,
        fechaInicio: "2024-02-01",
        fechaFin: "2026-06-30",
        objetivosSeed: [
          "1. Comprobar la ausencia de imagen en base de datos",
          "2. Ajustar el ancho del bloque de texto dinámicamente",
          "3. Conservar la estética limpia de la plataforma REASONS"
        ],
        keywordsSeed: ["Diseño Adaptativo", "Prueba Null", "Sin Imagen"]
      }
    ];

    for (const proyecto of proyectos) {
      const { objetivosSeed, keywordsSeed, ...proyectoData } = proyecto;
      await Proyecto.upsert(proyectoData);
      const instance = await Proyecto.findByPk(proyecto.id);
      if (instance) {
        if (proyecto.id === 1) {
          await (instance as any).setInvestigadores([1, 2]);
          await (instance as any).setLineas([1, 2, 3]);
        } else if (proyecto.id === 2) {
          await (instance as any).setInvestigadores([3, 4]);
          await (instance as any).setLineas([1, 2]);
        }

        // Seed objectives
        await ProyectoObjetivo.destroy({ where: { proyectoId: proyecto.id } });
        await ProyectoObjetivo.bulkCreate(
          objetivosSeed.map(descripcion => ({ descripcion, proyectoId: proyecto.id }))
        );

        // Seed keywords
        await ProyectoKeyword.destroy({ where: { proyectoId: proyecto.id } });
        await ProyectoKeyword.bulkCreate(
          keywordsSeed.map(nombre => ({ nombre, proyectoId: proyecto.id }))
        );
      }
    }

    const publicaciones = [
      {
        id: 1,
        titulo: "Optimizing Renewable Energy Integration in Urban Grids: A Multi-Variable Analysis",
        autores: "Dr. E. Carter, A. Rodriguez, S. Patel",
        resumen: "This study presents a novel framework for integrating diverse renewable energy sources into existing urban power grids. By analyzing multi-variable data from three major metropolitan areas, we identify key bottlenecks in current infrastructural models and propose algorithmic adjustments to load balancing that improve efficiency by up to 18%. The findings offer a scalable solution for municipalities transitioning to sustainable energy policies.",
        cita: "Carter, E., et al. (2024). Journal of Sustainable Engineering, 42(3), 112-128.",
        portada: "/uploads/publicaciones/default.png",
        doi: "10.1016/j.jse.2024.03.012",
        url: "https://example.org/renewable-energy-integration",
        // Relational field to seed in child table
        keywordsSeed: ["Renewable Energy", "Smart Grids", "Urban Infrastructure"]
      },
      {
        id: 2,
        titulo: "Publicación Científica de Prueba Sin Portada Asociada",
        autores: "Dr. Israel Naranjo Chiriboga, Franklin Tigre Ortega",
        resumen: "Esta publicación secundaria de prueba no contiene ninguna imagen de portada registrada en la base de datos. Sirve para constatar que el diseño horizontal y de rejilla en el frontend colapsa elegantemente el espacio lateral reservado para la portada y optimiza el espaciado y la lectura del abstract y cita de la investigación.",
        cita: "Naranjo, I., & Tigre, F. (2025). Revista de Innovación Sostenible REASONS, 3(1), 12-25.",
        portada: null,
        doi: "10.5281/zenodo.reasons.2025.02",
        url: "https://orcid.org/0000-0001-5774-1879",
        keywordsSeed: ["Prueba de Portada", "Layout Flexible", "REASONS"]
      }
    ];

    for (const publicacion of publicaciones) {
      const { keywordsSeed, ...publicacionData } = publicacion;
      await Publicacion.upsert(publicacionData);
      const instance = await Publicacion.findByPk(publicacion.id);
      if (instance) {
        if (publicacion.id === 1) {
          await (instance as any).setInvestigadores([3]);
          await (instance as any).setLineas([1, 2, 3]);
        } else if (publicacion.id === 2) {
          await (instance as any).setInvestigadores([1, 2]);
          await (instance as any).setLineas([1, 3]);
        }

        // Seed keywords
        await PublicacionKeyword.destroy({ where: { publicacionId: publicacion.id } });
        await PublicacionKeyword.bulkCreate(
          keywordsSeed.map(nombre => ({ nombre, publicacionId: publicacion.id }))
        );
      }
    }

    await resetSequences(sequelize);

    console.log("Seed completado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al ejecutar el seed:", error);
    process.exit(1);
  }
}

seed();