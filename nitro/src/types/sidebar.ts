import { LucideIcon } from "lucide-react";

export interface User {
    name: string;
    email: string;
    avatar: string;
    role?: string;
}

export interface Team {
    name: string;
    logo: LucideIcon;
    plan: string;
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
        permissionRequired?: string;
    }[];
}