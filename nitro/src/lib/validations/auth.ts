import { z } from 'zod';

/**
 * Esquema de validación para el formulario de inicio de sesión
 *
 * Define las reglas de validación para los campos del formulario de login:
 * - El email es obligatorio y debe tener formato de correo electrónico
 * - La contraseña debe tener al menos 6 caracteres
 *
 * @const {z.ZodObject}
 * @category Validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El email es requerido' })
    .email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

/**
 * Tipo inferido del esquema de validación para el formulario de login
 * Utilizado para tipado estricto en componentes React y funciones de manejo de formularios
 *
 * @typedef {z.infer<typeof loginSchema>} LoginFormValues
 * @category Validation
 */
export type LoginFormValues = z.infer<typeof loginSchema>;
