import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/auth-options';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';

const prisma = new PrismaClient();

// Esquema de validación
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(7, 'La contraseña debe tener al menos 7 caracteres')
    .refine((value) => /[A-Z]/.test(value), 'Debe contener al menos una letra mayúscula')
    .refine((value) => /[a-z]/.test(value), 'Debe contener al menos una letra minúscula')
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      'Debe contener al menos un carácter especial'
    ),
});

export async function POST(req: NextRequest) {
  try {
    // Verificar sesión
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Validar datos de entrada
    const body = await req.json();
    const result = passwordChangeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.format() },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    // Obtener usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si la contraseña está definida
    if (!user.password) {
      return NextResponse.json(
        { error: 'Contraseña no establecida para el usuario' },
        { status: 400 }
      );
    }

    // Verificar contraseña actual
    const passwordMatch = await compare(currentPassword, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
    }

    // Actualizar contraseña
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
