# Nitro Base


## Estructura de la Base de Datos

### Tablas Principales

El sistema utiliza Prisma ORM para gestionar la base de datos con las siguientes tablas principales:

- **User**: Almacena información de usuarios del sistema
- **Role**: Define roles disponibles (Admin, User, etc.)
- **Permission**: Permisos individuales del sistema
- **RolePermission**: Relación muchos a muchos entre roles y permisos
- **UserRole**: Asigna roles a usuarios específicos
- **Session**: Gestiona sesiones de usuario activas
- **PasswordReset**: Almacena tokens para restablecimiento de contraseñas

### Relaciones

- Un usuario puede tener múltiples roles
- Cada rol contiene múltiples permisos
- Las sesiones están vinculadas a un usuario específico

## Sistema de Autenticación

La autenticación se maneja a través de NextAuth.js con los siguientes métodos:

1. **Autenticación basada en credenciales**: Email/contraseña
2. **Sesiones JWT**: Almacenadas tanto en cookies como en base de datos

El flujo de autenticación incluye:
- Login/registro de usuarios
- Verificación de email (opcional)
- Recuperación de contraseña
- Bloqueo de cuentas después de intentos fallidos

## Gestión de Permisos

El sistema implementa un control de acceso basado en roles (RBAC):

1. **Roles**: Agrupaciones de permisos (ej. Admin, Editor, Viewer)
2. **Permisos**: Acciones específicas permitidas (ej. create:user, update:profile)
3. **Middleware de autorización**: Verifica permisos en rutas protegidas

Los permisos se verifican a nivel de:
- API Routes (middleware)
- Componentes de UI (directivas condicionales)
- Acciones del lado del servidor

## Configuración de Prisma

### Instalación y Configuración

1. Instala las dependencias necesarias:

```bash
npm install prisma @prisma/client
npm install -D prisma
```

2. Inicializa Prisma en tu proyecto:

```bash
npx prisma init
```

3. Configura la conexión a la base de datos en el archivo `.env`:

```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
```

### Estructura de Esquemas

El archivo `prisma/schema.prisma` contiene la definición de todas las tablas y relaciones:

```prisma
// Ejemplo simplificado del esquema
model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  password       String
  userRoles      UserRole[]
  sessions       Session[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Role {
  id             String    @id @default(cuid())
  name           String    @unique
  userRoles      UserRole[]
  rolePermissions RolePermission[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

// Otras definiciones de modelos...
```

### Generación de Tablas

Para crear las tablas en la base de datos:

```bash
npx prisma migrate dev --name init
```

Este comando:
1. Genera una migración basada en tu esquema
2. Aplica la migración a tu base de datos
3. Regenera el cliente Prisma

### Carga de Datos Iniciales (Seed)

Ejecuta el seed:

```bash
npm run seed
```

