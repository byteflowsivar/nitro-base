import { LucideIcon } from "lucide-react";

/**
 * Interfaz que define la estructura de un usuario en la barra lateral
 * 
 * @interface
 * @category Types
 */
export interface User {
    /** Nombre completo del usuario */
    name: string;
    /** Dirección de correo electrónico del usuario */
    email: string;
    /** URL de la imagen de avatar del usuario */
    avatar: string;
    /** Rol del usuario (opcional) */
    role?: string;
}

/**
 * Interfaz que define la estructura de un equipo en la barra lateral
 * 
 * @interface
 * @category Types
 */
export interface Team {
    /** Nombre del equipo */
    name: string;
    /** Icono de Lucide React utilizado como logo */
    logo: LucideIcon;
    /** Plan de suscripción del equipo */
    plan: string;
}

/**
 * Interfaz que define la estructura de un ítem de navegación
 * 
 * @interface
 * @category Types
 */
export interface NavItem {
    /** Título del elemento de navegación */
    title: string;
    /** URL de destino */
    url: string;
    /** Icono de Lucide React (opcional) */
    icon?: LucideIcon;
    /** Indica si el elemento está activo */
    isActive?: boolean;
    /** Subelementos anidados (opcional) */
    items?: {
        /** Título del subelemento */
        title: string;
        /** URL de destino del subelemento */
        url: string;
        /** Permiso requerido para ver este elemento (opcional) */
        permissionRequired?: string;
    }[];
}