'use client';

import { useSession } from "next-auth/react";
import { Metadata } from "next";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Email</div>
                        <div className="text-gray-500 dark:text-gray-400">{session?.user?.email}</div>
                    </div>

                    <div className="grid gap-2">
                        <div className="font-medium">ID</div>
                        <div className="text-gray-500 dark:text-gray-400">{session?.user?.id}</div>
                    </div>

                    <div className="grid gap-2">
                        <div className="font-medium">Roles</div>
                        <div className="text-gray-500 dark:text-gray-400">
                            {session?.user?.roles?.map((role) => (
                                <span key={role} className="mr-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="font-medium">Permisos</div>
                        <div className="text-gray-500 dark:text-gray-400">
                            {session?.user?.permissions?.map((permission) => (
                                <span key={permission} className="mr-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    {permission}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                        <div>
                            <div className="font-medium">Usuarios</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Gestión de usuarios</div>
                        </div>
                    </div>

                    <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                        <div>
                            <div className="font-medium">Inventario</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Control de stock</div>
                        </div>
                    </div>

                    <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                        <div>
                            <div className="font-medium">Facturación</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Gestión de facturas</div>
                        </div>
                    </div>

                    <div className="flex items-center rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                        <div>
                            <div className="font-medium">Reportes</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Informes y estadísticas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}