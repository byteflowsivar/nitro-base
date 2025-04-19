import "next-auth";
import "next-auth/jwt";

// Extender la interfaz de Session para incluir roles y permisos
declare module "next-auth" {
    interface User {
        id: string;
        role?: string;
        roles?: string[];
        permissions?: string[];
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            roles?: string[];
            permissions?: string[];
        }
    }
}

// Extender la interfaz JWT para incluir roles y permisos
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string;
        roles?: string[];
        permissions?: string[];
    }
}