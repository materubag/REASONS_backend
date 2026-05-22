const swaggerSpec = {
  openapi: "3.0.3",

  info: {
    title: "REASONS API",
    version: "1.0.0",
    description: "Documentación oficial de REASONS API",
  },

  servers: [
    {
      url: "http://localhost:3000",
    },
  ],

  tags: [
    { name: "Usuario", description: "Autenticación y usuarios" },
    { name: "Investigador", description: "Gestión de investigadores" },
    { name: "Proyecto", description: "Gestión de proyectos" },
    { name: "Publicacion", description: "Gestión de publicaciones" },
    { name: "LineaInvestigacion", description: "Gestión de líneas de investigación" },
    { name: "Contacto", description: "Gestión de contactos" },
    { name: "GrupoInformacion", description: "Gestión de información del grupo" },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      AuthRegister: {
        type: "object",
        required: ["nombre", "correo", "password"],
        properties: {
          nombre: { type: "string" },
          correo: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },

      AuthLogin: {
        type: "object",
        required: ["correo", "password"],
        properties: {
          correo: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },

      Usuario: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          correo: { type: "string" },
          rol: { type: "string" },
        },
      },

      Investigador: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          orcid: { type: "string" },
          correo: { type: "string" },
          biografia: { type: "string" },
          cargo: { type: "string" },
          foto: { type: "string" },
          linkedin: { type: "string" },
          facebook: { type: "string" },
          instagram: { type: "string" },
          telegram: { type: "string" },
        },
      },

      InvestigadorPatch: {
        type: "object",
        properties: {
          nombre: { type: "string", nullable: true, default: "" },
          orcid: { type: "string", nullable: true, default: "" },
          correo: { type: "string", nullable: true, default: "" },
          biografia: { type: "string", nullable: true, default: "" },
          cargo: { type: "string", nullable: true, default: "" },
          foto: { type: "string", nullable: true, default: "" },
          linkedin: { type: "string", nullable: true, default: "" },
          facebook: { type: "string", nullable: true, default: "" },
          instagram: { type: "string", nullable: true, default: "" },
          telegram: { type: "string", nullable: true, default: "" },
        },
      },

      Proyecto: {
        type: "object",
        properties: {
          id: { type: "integer" },
          titulo: { type: "string" },
          descripcion: { type: "string" },
          objetivos: { type: "string" },
          resultados: { type: "string" },
          imagen: { type: "string" },
        },
      },

      ProyectoPatch: {
        type: "object",
        properties: {
          titulo: { type: "string", nullable: true, default: "" },
          descripcion: { type: "string", nullable: true, default: "" },
          objetivos: { type: "string", nullable: true, default: "" },
          resultados: { type: "string", nullable: true, default: "" },
          imagen: { type: "string", nullable: true, default: "" },
        },
      },

      Publicacion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          titulo: { type: "string" },
          autores: { type: "string" },
          resumen: { type: "string" },
          cita: { type: "string" },
          portada: { type: "string" },
          doi: { type: "string" },
          url: { type: "string" },
        },
      },

      PublicacionPatch: {
        type: "object",
        properties: {
          titulo: { type: "string", nullable: true, default: "" },
          autores: { type: "string", nullable: true, default: "" },
          resumen: { type: "string", nullable: true, default: "" },
          cita: { type: "string", nullable: true, default: "" },
          portada: { type: "string", nullable: true, default: "" },
          doi: { type: "string", nullable: true, default: "" },
          url: { type: "string", nullable: true, default: "" },
        },
      },

      LineaInvestigacion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          descripcion: { type: "string" },
        },
      },

      LineaInvestigacionPatch: {
        type: "object",
        properties: {
          nombre: { type: "string", nullable: true, default: "" },
          descripcion: { type: "string", nullable: true, default: "" },
        },
      },

      Contacto: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          correo: { type: "string" },
          mensaje: { type: "string" },
          fecha: { type: "string" },
        },
      },

      GrupoInformacion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          descripcion: { type: "string" },
          objetivoGeneral: { type: "string" },
          objetivosEspecificos: { type: "string" },
          dominio: { type: "string" },
          direccion: { type: "string" },
          correo: { type: "string" },
          logo: { type: "string" },
        },
      },

      GrupoInformacionPatch: {
        type: "object",
        properties: {
          nombre: { type: "string", nullable: true, default: "" },
          descripcion: { type: "string", nullable: true, default: "" },
          objetivoGeneral: { type: "string", nullable: true, default: "" },
          objetivosEspecificos: { type: "string", nullable: true, default: "" },
          dominio: { type: "string", nullable: true, default: "" },
          direccion: { type: "string", nullable: true, default: "" },
          correo: { type: "string", nullable: true, default: "" },
          logo: { type: "string", nullable: true, default: "" },
        },
      },
    },
  },

  paths: {
    "/api/auth/usuarios": {
      get: {
        tags: ["Usuario"],
        summary: "Listar usuarios",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de usuarios" },
        },
      },
    },

    "/api/auth/register": {
      post: {
        tags: ["Usuario"],
        summary: "Registrar usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRegister" },
            },
          },
        },
        responses: {
          "201": { description: "Usuario creado" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Usuario"],
        summary: "Iniciar sesión",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLogin" },
            },
          },
        },
        responses: {
          "200": { description: "Sesión iniciada" },
        },
      },
    },

    "/api/investigadores": {
      get: {
        tags: ["Investigador"],
        summary: "Listar investigadores",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de investigadores" },
        },
      },

      post: {
        tags: ["Investigador"],
        summary: "Crear investigador",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Investigador" },
                  {
                    type: "object",
                    properties: {
                      foto: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Investigador creado" },
        },
      },
    },

    "/api/investigadores/{id}": {
      get: {
        tags: ["Investigador"],
        summary: "Obtener investigador por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Investigador encontrado" },
        },
      },

      put: {
        tags: ["Investigador"],
        summary: "Actualizar investigador",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Investigador" },
                  {
                    type: "object",
                    properties: {
                      foto: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Investigador actualizado" },
        },
      },

      patch: {
        tags: ["Investigador"],
        summary: "Actualizar parcialmente investigador",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/InvestigadorPatch" },
                  {
                    type: "object",
                    properties: {
                      foto: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Investigador actualizado" },
        },
      },

      delete: {
        tags: ["Investigador"],
        summary: "Eliminar investigador",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Investigador eliminado" },
        },
      },
    },

    "/api/proyectos": {
      get: {
        tags: ["Proyecto"],
        summary: "Listar proyectos",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de proyectos" },
        },
      },

      post: {
        tags: ["Proyecto"],
        summary: "Crear proyecto",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Proyecto" },
                  {
                    type: "object",
                    properties: {
                      imagen: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Proyecto creado" },
        },
      },
    },

    "/api/proyectos/{id}": {
      get: {
        tags: ["Proyecto"],
        summary: "Obtener proyecto por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Proyecto encontrado" },
        },
      },

      put: {
        tags: ["Proyecto"],
        summary: "Actualizar proyecto",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Proyecto" },
                  {
                    type: "object",
                    properties: {
                      imagen: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Proyecto actualizado" },
        },
      },

      patch: {
        tags: ["Proyecto"],
        summary: "Actualizar parcialmente proyecto",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ProyectoPatch" },
                  {
                    type: "object",
                    properties: {
                      imagen: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Proyecto actualizado" },
        },
      },

      delete: {
        tags: ["Proyecto"],
        summary: "Eliminar proyecto",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Proyecto eliminado" },
        },
      },
    },

    "/api/publicaciones": {
      get: {
        tags: ["Publicacion"],
        summary: "Listar publicaciones",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de publicaciones" },
        },
      },

      post: {
        tags: ["Publicacion"],
        summary: "Crear publicación",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Publicacion" },
                  {
                    type: "object",
                    properties: {
                      portada: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Publicación creada" },
        },
      },
    },

    "/api/publicaciones/{id}": {
      get: {
        tags: ["Publicacion"],
        summary: "Obtener publicación por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Publicación encontrada" },
        },
      },

      put: {
        tags: ["Publicacion"],
        summary: "Actualizar publicación",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Publicacion" },
                  {
                    type: "object",
                    properties: {
                      portada: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Publicación actualizada" },
        },
      },

      patch: {
        tags: ["Publicacion"],
        summary: "Actualizar parcialmente publicación",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/PublicacionPatch" },
                  {
                    type: "object",
                    properties: {
                      portada: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Publicación actualizada" },
        },
      },

      delete: {
        tags: ["Publicacion"],
        summary: "Eliminar publicación",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Publicación eliminada" },
        },
      },
    },

    "/api/lineas-investigacion": {
      get: {
        tags: ["LineaInvestigacion"],
        summary: "Listar líneas de investigación",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de líneas" },
        },
      },

      post: {
        tags: ["LineaInvestigacion"],
        summary: "Crear línea de investigación",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LineaInvestigacion" },
            },
          },
        },
        responses: {
          "201": { description: "Línea creada" },
        },
      },
    },

    "/api/lineas-investigacion/{id}": {
      get: {
        tags: ["LineaInvestigacion"],
        summary: "Obtener línea por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Línea encontrada" },
        },
      },

      put: {
        tags: ["LineaInvestigacion"],
        summary: "Actualizar línea",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LineaInvestigacion" },
            },
          },
        },
        responses: {
          "200": { description: "Línea actualizada" },
        },
      },

      patch: {
        tags: ["LineaInvestigacion"],
        summary: "Actualizar parcialmente línea",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LineaInvestigacionPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Línea actualizada" },
        },
      },

      delete: {
        tags: ["LineaInvestigacion"],
        summary: "Eliminar línea",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Línea eliminada" },
        },
      },
    },

    "/api/contactos": {
      get: {
        tags: ["Contacto"],
        summary: "Listar contactos",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Lista de contactos" },
        },
      },

      post: {
        tags: ["Contacto"],
        summary: "Enviar mensaje de contacto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Contacto" },
            },
          },
        },
        responses: {
          "201": { description: "Mensaje enviado" },
        },
      },
    },

    "/api/contactos/{id}": {
      get: {
        tags: ["Contacto"],
        summary: "Obtener contacto por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Contacto encontrado" },
        },
      },

      delete: {
        tags: ["Contacto"],
        summary: "Eliminar contacto",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Contacto eliminado" },
        },
      },
    },

    "/api/grupo-informacion": {
      get: {
        tags: ["GrupoInformacion"],
        summary: "Obtener información del grupo",
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": { description: "Información del grupo" },
        },
      },

      post: {
        tags: ["GrupoInformacion"],
        summary: "Crear información del grupo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/GrupoInformacion" },
                  {
                    type: "object",
                    properties: {
                      logo: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Información creada" },
        },
      },
    },

    "/api/grupo-informacion/{id}": {
      get: {
        tags: ["GrupoInformacion"],
        summary: "Obtener información del grupo por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Información encontrada" },
        },
      },

      put: {
        tags: ["GrupoInformacion"],
        summary: "Actualizar información del grupo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/GrupoInformacion" },
                  {
                    type: "object",
                    properties: {
                      logo: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Información actualizada" },
        },
      },

      patch: {
        tags: ["GrupoInformacion"],
        summary: "Actualizar parcialmente información del grupo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/GrupoInformacionPatch" },
                  {
                    type: "object",
                    properties: {
                      logo: { type: "string", format: "binary" },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Información actualizada" },
        },
      },

      delete: {
        tags: ["GrupoInformacion"],
        summary: "Eliminar información del grupo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Información eliminada" },
        },
      },
    },
  },
};

export default swaggerSpec;