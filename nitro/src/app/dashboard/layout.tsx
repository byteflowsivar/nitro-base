'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirigir a login si no hay sesión
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/dashboard");
        }
    }, [status, router]);

    // Mostrar estado de carga mientras se verifica la sesión
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Barra lateral */}
            <aside className="w-full border-r bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 md:w-64">
                <div className="mb-6 flex items-center">
                    <h2 className="text-xl font-bold">Nitro Dashboard</h2>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bienvenido, {session?.user?.name || session?.user?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Roles: {session?.user?.roles?.join(", ")}
                    </p>
                </div>

                <nav className="space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Inicio Dashboard
                    </Link>

                    {/* Mostrar enlaces administrativos solo a usuarios con rol admin */}
                    {session?.user?.roles?.includes("admin") && (
                        <Link
                            href="/dashboard/admin"
                            className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Panel de Administración
                        </Link>
                    )}

                    <Link
                        href="/api/auth/signout?callbackUrl=/"
                        className="flex items-center rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Cerrar sesión
                    </Link>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}