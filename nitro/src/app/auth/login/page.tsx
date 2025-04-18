'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"


export default function LoginPage() {
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
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Panel izquierdo - Testimonial */}
            <div className="relative hidden w-full bg-gray-800 md:flex md:w-1/2 md:flex-col md:items-start md:justify-between p-8">
                <div className="flex items-center">
                    <div className="mr-2">
                        <Image src="/window.svg" alt="Logo" width={24} height={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Nitro.</h2>
                </div>

                <div className="my-auto max-w-md">
                    <blockquote className="text-xl font-medium text-white">
                        &ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.&rdquo;
                    </blockquote>
                    <div className="mt-6 text-base text-gray-400">
                        Sofia Davis
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 md:w-1/2 md:px-20 lg:px-32">
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

                    <p className="text-center text-sm text-gray-500">
                        Al ingresar usted acepta nuestros{' '}
                        <Link href="#" className="underline underline-offset-2 hover:text-gray-900">
                            Terminos de Servicio
                        </Link>{' '}
                        y{' '}
                        <Link href="#" className="underline underline-offset-2 hover:text-gray-900">
                            Politicas de Privacidad
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}