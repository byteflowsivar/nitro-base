import { useSession } from "next-auth/react";

/**
 * Hook personalizado para verificar los permisos del usuario actual
 * 
 * @function usePermissions
 * @category Auth
 * @returns {{ hasPermission: (permission: string) => boolean }} Objeto con funciones de utilidad para comprobar permisos
 * 
 * @example
 * ```tsx
 * // En un componente React
 * const { hasPermission } = usePermissions();
 * 
 * // Verificar si el usuario puede acceder a la sección de administración
 * if (hasPermission('admin.dashboard')) {
 *   // Mostrar funcionalidades de administrador
 * }
 * ```
 */
export function usePermissions() {
    const { data: session } = useSession();

    /**
     * Verifica si el usuario tiene un permiso específico
     * 
     * @function hasPermission
     * @param {string} permission - El permiso a verificar
     * @returns {boolean} - true si tiene el permiso, false en caso contrario
     */
    const hasPermission = (permission: string): boolean => {
        // Si no hay sesión o roles, denegar acceso
        if (!session?.user?.roles) {
            return false;
        }

        // Implementación básica - expandir según necesidades
        const rolePermissions: Record<string, string[]> = {
            admin: ["all", "users.manage", "roles.manage", "settings.manage", "admin.dashboard"],
            user: ["dashboard.view"]
        };

        // Si el usuario tiene el rol "admin", permitir todo
        if (session.user.roles.includes("admin") && permission !== "all") {
            return true;
        }

        // Verificar si alguno de los roles del usuario incluye el permiso solicitado
        for (const role of session.user.roles) {
            if (rolePermissions[role]?.includes(permission)) {
                return true;
            }
        }
        return false;
    };

    return { hasPermission };
}