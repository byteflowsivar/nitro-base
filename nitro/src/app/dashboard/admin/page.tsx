'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // Verificación adicional en el cliente para roles de administrador
    useEffect(() => {
        if (session && !session.user.roles.includes('admin')) {
            router.push('/auth/access-denied');
        }
    }, [session, router]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-gray-500 dark:text-gray-400">
                Área restringida solo para administradores.
            </p>

            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>

                <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                        <h3 className="font-medium text-amber-800 dark:text-amber-300">Acceso Restringido</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                            Solo los administradores pueden ver y administrar esta sección.
                            Tu rol actual es: <span className="font-bold">{session?.user?.roles?.includes('admin') ? 'Administrador' : 'No autorizado'}</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Funciones Administrativas</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Gestionar usuarios y roles</li>
                            <li>Asignar permisos</li>
                            <li>Ver registros de auditoría</li>
                            <li>Configuración del sistema</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h2 className="text-xl font-semibold mb-4">Usuarios del Sistema</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Aquí aparecería un listado de todos los usuarios registrados con opciones para editar roles y permisos.</p>
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h2 className="text-xl font-semibold mb-4">Roles y Permisos</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Gestión de roles y permisos del sistema inspirado en Keycloak.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}