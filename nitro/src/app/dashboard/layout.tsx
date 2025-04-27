/**
 * Layout principal para el dashboard de la aplicación
 * Verifica la autenticación del usuario y muestra elementos de navegación
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar dentro del layout
 * @returns {JSX.Element} Componente de layout renderizado
 */
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePermissions } from "@/hooks/use-permissions";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const router = useRouter();
    const { hasPermission } = usePermissions();

    // Redirigir a login si no hay sesión
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/dashboard");
        }
    }, [status, router]);

    // Verificar acceso cuando cambie la ruta (para rutas específicas como dashboard/admin)
    useEffect(() => {
        // Solo ejecutar esta verificación cuando la sesión esté cargada y no sea "unauthenticated"
        if (status !== "loading" && status !== "unauthenticated") {
            const currentPath = window.location.pathname;

            // Verificar permisos para rutas administrativas
            if (currentPath.includes('/dashboard/admin') && !hasPermission('roles.manage')) {
                router.push('/auth/access-denied');
            }
        }
    }, [router, hasPermission, status]);

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
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Nitro Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {/* Contenido principal */}
                    <main className="flex-1 p-6">{children}</main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}