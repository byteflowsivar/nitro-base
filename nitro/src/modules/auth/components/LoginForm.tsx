'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginFormValues) {
        try {
            setIsLoading(true);
            setError(null);

            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (!result?.ok) {
                setError(result?.error || 'Error en la autenticación');
                return;
            }

            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            setError('Ocurrió un error durante el inicio de sesión');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">Autenticación</h1>
                <p className="text-sm text-gray-500">
                    Ingrese su email y password.
                </p>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="correo@example.com"
                        disabled={isLoading}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        disabled={isLoading}
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-gray-800 py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
                </Button>
            </form>
        </div>
    );
}