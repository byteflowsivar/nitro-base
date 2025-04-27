import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Función para crear roles y permisos por defecto en la base de datos
 */
async function seedRolesAndPermissions() {
  // Verificar si ya existen roles para evitar duplicados
  const adminRoleExists = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  const userRoleExists = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  // Crear rol de administrador si no existe
  if (!adminRoleExists) {
    await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Rol de administrador con acceso completo',
        permissions: {
          create: [
            { name: 'users:read', description: 'Ver usuarios' },
            { name: 'users:write', description: 'Crear/editar usuarios' },
            { name: 'users:delete', description: 'Eliminar usuarios' },
            { name: 'roles:manage', description: 'Gestionar roles y permisos' },
          ],
        },
      },
    });
    console.log('✅ Rol de administrador creado');
  }

  // Crear rol de usuario si no existe
  if (!userRoleExists) {
    await prisma.role.create({
      data: {
        name: 'user',
        description: 'Rol de usuario estándar',
        permissions: {
          create: [
            { name: 'profile:read', description: 'Ver perfil propio' },
            { name: 'profile:write', description: 'Editar perfil propio' },
          ],
        },
      },
    });
    console.log('✅ Rol de usuario creado');
  }

  console.log('✅ Roles y permisos básicos configurados');
}

/**
 * Función para crear un usuario administrador por defecto
 */
async function seedAdminUser() {
  // Verificar si ya existe un usuario administrador
  const adminEmail = 'admin@ejemplo.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // Crear usuario administrador
    const hashedPassword = await hash('Admin123!', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Buscar el rol de administrador
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (adminRole) {
      // Asignar rol de administrador al usuario
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      });
    }

    console.log('✅ Usuario administrador creado');
  } else {
    console.log('ℹ️ El usuario administrador ya existe');
  }
}

/**
 * Función principal para sembrar datos iniciales
 */
export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando siembra de datos iniciales...');

    // Crear roles y permisos
    await seedRolesAndPermissions();

    // Crear usuario administrador
    await seedAdminUser();

    console.log('✅ Datos iniciales sembrados correctamente');
  } catch (error) {
    console.error('❌ Error al sembrar datos iniciales:', error);
  } finally {
    await prisma.$disconnect();
  }
}
