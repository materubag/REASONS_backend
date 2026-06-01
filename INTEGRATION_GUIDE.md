## Integración de Servicios y Utilidades

Todos los servicios y utilidades han sido integrados en el backend. Aquí están los cambios principales:

### ✅ Archivos Actualizados

#### **Middlewares**
- **auth.middleware.ts** - Ahora usa `verifyToken()` de `utils/jwt.ts`
- **upload.middleware.ts** - Actualizado para validar archivos con `validateUploadFile()`
- **multer.middleware.ts** - Nuevo, configura multer para diferentes tipos de upload

#### **Controllers**
- **auth.controller.ts** - Usa `loginService` y `registerService`
- **investigadores.controller.ts** - Listado con paginación
- **proyectos.controller.ts** - Listado con paginación
- **publicaciones.controller.ts** - Listado con paginación
- **contactos.controller.ts** - Listado con paginación
- **lineasInvestigacion.controller.ts** - Listado con paginación
- **grupoInformacion.controller.ts** - Listado con paginación

### 📚 Ejemplos de Uso

#### **Login/Register**
```typescript
import { loginService, registerService } from "@/services";

// Login
const result = await loginService({
  correo: "user@example.com",
  password: "password123"
});

if (result.success) {
  console.log("Token:", result.token);
  console.log("Usuario:", result.user);
}

// Register
const newUser = await registerService({
  nombre: "John Doe",
  correo: "john@example.com",
  password: "securePassword123"
});
```

#### **Paginación en Listados**
```typescript
import { calculatePagination, buildPaginationMeta } from "@/utils";
import { Investigador } from "@/models";

// En el controlador
const { limit, offset, page } = calculatePagination(req.query);
// Con ?page=2&limit=20 devuelve: { limit: 20, offset: 20, page: 2 }

const { count, rows } = await Investigador.findAndCountAll({
  limit,
  offset,
  order: [["id", "DESC"]]
});

res.json({
  success: true,
  data: rows,
  meta: buildPaginationMeta(page, limit, count)
  // meta: { page: 2, limit: 20, total: 100, totalPages: 5, hasNextPage: true, hasPrevPage: true }
});
```

#### **Upload de Archivos**
```typescript
import { UploadType, processUploadFile, validateUploadFile } from "@/services/upload.service";
import { uploadInvestigador } from "@/middlewares/multer.middleware";
import { validateUploadMiddleware } from "@/middlewares/upload.middleware";

// En la ruta
router.post(
  "/investigadores",
  uploadInvestigador,
  validateUploadMiddleware(UploadType.INVESTIGADORES),
  controller.createInvestigador
);

// En el controlador
const result = await processUploadFile({
  type: UploadType.INVESTIGADORES,
  file: req.file
});

if (result.success) {
  // Guardar en base de datos
  await Investigador.create({
    nombre: req.body.nombre,
    foto: result.relativePath,
    ...
  });
}
```

#### **JWT Token**
```typescript
import { generateToken, verifyToken } from "@/utils/jwt";

// Generar token
const token = generateToken({
  id: 1,
  correo: "user@example.com",
  rol: "admin"
});

// Verificar token
const payload = verifyToken(token);
if (payload) {
  console.log("Token válido, usuario:", payload);
} else {
  console.log("Token inválido o expirado");
}
```

#### **Password con Bcrypt**
```typescript
import { hashPassword, comparePassword } from "@/utils/bcrypt";

// Hash
const hashedPassword = await hashPassword("myPassword123");
await Usuario.create({
  correo: "user@example.com",
  password: hashedPassword
});

// Verificar
const user = await Usuario.findByPk(1);
const isValid = await comparePassword("myPassword123", user.password);
if (isValid) {
  console.log("Contraseña correcta");
}
```

#### **Gestión de Archivos**
```typescript
import { deleteFile, deleteFiles, fileExists, generateUniqueFilename } from "@/utils/file";

// Eliminar archivo
await deleteFile("investigadores/foto-123.jpg");

// Eliminar múltiples
await deleteFiles([
  "investigadores/foto-1.jpg",
  "investigadores/foto-2.jpg"
]);

// Verificar existencia
if (fileExists("investigadores/foto-123.jpg")) {
  console.log("El archivo existe");
}

// Generar nombre único
const filename = generateUniqueFilename("profile.jpg");
// Devuelve: profile-1715971234567-456789123.jpg
```

### 🔧 Tipos de Upload Disponibles

| Tipo | Carpeta | Extensiones | Tamaño Max | Descripción |
|------|---------|-------------|-----------|------------|
| INVESTIGADORES | investigadores | JPG, PNG, WebP | 5MB | Fotos de investigadores |
| LOGOS | logos | JPG, PNG, SVG, WebP | 2MB | Logos |
| PROYECTOS | proyectos | JPG, PNG, WebP | 10MB | Imágenes de proyectos |
| PUBLICACIONES | publicaciones | JPG, PNG, PDF, WebP | 15MB | Portadas de publicaciones |
| GRUPO_INFORMACION | grupo_informacion | JPG, PNG, WebP | 8MB | Imágenes del grupo |

### 📦 Imports Centralizados

En lugar de importar desde archivos específicos:

```typescript
// ❌ Evita esto
import { hashPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { calculatePagination } from "../utils/pagination";
import { deleteFile } from "../utils/file";

// ✅ Usa esto
import { 
  hashPassword, 
  generateToken, 
  calculatePagination, 
  deleteFile 
} from "../utils";
```

Lo mismo para servicios:

```typescript
// ❌ Evita esto
import { loginService } from "../services/auth.service";
import { UploadType } from "../services/upload.service";

// ✅ Usa esto
import { loginService, UploadType } from "../services";
```
