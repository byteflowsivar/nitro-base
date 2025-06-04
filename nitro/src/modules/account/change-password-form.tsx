'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
      .string()
      .min(7, 'La contraseña debe tener al menos 7 caracteres')
      .refine((value) => /[A-Z]/.test(value), 'Debe contener al menos una letra mayúscula')
      .refine((value) => /[a-z]/.test(value), 'Debe contener al menos una letra minúscula')
      .refine(
        (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        'Debe contener al menos un carácter especial'
      ),
    confirmPassword: z.string().min(1, 'Confirme su nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = form.watch('newPassword');

  // Criterios de validación visual
  const passwordCriteria = [
    { id: 'length', label: 'Al menos 7 caracteres', valid: newPassword.length >= 7 },
    { id: 'uppercase', label: 'Al menos una mayúscula', valid: /[A-Z]/.test(newPassword) },
    { id: 'lowercase', label: 'Al menos una minúscula', valid: /[a-z]/.test(newPassword) },
    {
      id: 'special',
      label: 'Al menos un símbolo',
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    },
  ];

  async function onChangePasswordEvent(data: PasswordFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contraseña actualizada', {
          description: 'Tu contraseña ha sido cambiada correctamente.',
        });
        form.reset();
      } else {
        toast.error('Error', {
          description: result.error || 'No se pudo actualizar la contraseña. Inténtalo de nuevo.',
        });
      }
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      toast.error('Error de conexión', {
        description:
          'Ocurrió un problema al conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>Actualiza tu contraseña para mantener segura tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="password-form"
            onSubmit={form.handleSubmit(onChangePasswordEvent)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña Actual</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-1"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Crea una contraseña segura"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-1"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FormMessage />
                  {/* Movido fuera de FormDescription para evitar el error de hidratación */}
                  <ul className="mt-2 space-y-1">
                    {passwordCriteria.map((criterion) => (
                      <li key={criterion.id} className="flex items-center text-xs">
                        {criterion.valid ? (
                          <Check className="mr-1 h-3 w-3 text-green-500" />
                        ) : (
                          <X className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        <span
                          className={criterion.valid ? 'text-green-700' : 'text-muted-foreground'}
                        >
                          {criterion.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu nueva contraseña"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="password-form" disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
        </Button>
      </CardFooter>
    </Card>
  );
}
