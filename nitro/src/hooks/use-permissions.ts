import { useSession } from "next-auth/react";

export function usePermissions() {
    const { data: session } = useSession();

    const hasPermission = (permission: string): boolean => {


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
        for (const role of session.user.roles) {
            if (rolePermissions[role]?.includes(permission)) {
                return true;
            }
        }
        return false;
    };

    return { hasPermission };
}