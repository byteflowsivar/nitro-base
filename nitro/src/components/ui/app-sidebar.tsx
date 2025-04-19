/**
 * Sidebar principal de la aplicación que muestra la navegación,
 * selector de equipo y perfil de usuario.
 * 
 * Este componente integra los diferentes elementos de la barra lateral:
 * - TeamSwitcher para cambiar entre equipos
 * - NavMain para la navegación principal con ítems anidados
 * - NavUser para la información y opciones del usuario actual
 * 
 * Además, implementa filtrado basado en permisos para la navegación.
 * 
 * @component
 * @param {React.ComponentProps<typeof Sidebar>} props - Props del componente Sidebar
 * @returns {JSX.Element} - Componente de sidebar renderizado
 * 
 * @example
 * // Uso en un layout
 * <SidebarProvider>
 *   <AppSidebar />
 *   <SidebarInset>
 *     {children}
 *   </SidebarInset>
 * </SidebarProvider>
 */
"use client"

import * as React from "react"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { usePermissions } from "@/hooks/use-permissions"
import { defaultUser, teams, navItems } from "@/lib/data/sidebar-data"
import { NavItem, User } from "@/types/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();
    const { hasPermission } = usePermissions();
    const [userData, setUserData] = React.useState<User>(defaultUser);

    /**
     * Filtra los elementos de navegación basados en los permisos del usuario
     * Los elementos con permissionRequired solo se muestran si el usuario tiene ese permiso
     */
    const filteredNavItems = React.useMemo(() => {
        return navItems.map(item => ({
            ...item,
            items: item.items?.filter(subItem =>
                !subItem.permissionRequired || hasPermission(subItem.permissionRequired)
            )
        })).filter(item => item.items?.length || !item.items);
    }, [hasPermission]);

    /**
     * Actualiza los datos del usuario cuando cambia la sesión
     */
    React.useEffect(() => {
        if (session?.user) {
            setUserData({
                name: session.user.name || defaultUser.name,
                email: session.user.email || defaultUser.email,
                avatar: session.user.image || defaultUser.avatar,
                role: session.user.role
            });
        }
    }, [session]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={userData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
