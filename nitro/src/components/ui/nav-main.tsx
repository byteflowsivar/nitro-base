'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

/**
 * Componente de navegación principal para la barra lateral
 *
 * Renderiza una lista de elementos de navegación, con soporte para
 * elementos anidados utilizando el componente Collapsible.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<{
 *   title: string,
 *   url: string,
 *   icon?: LucideIcon,
 *   isActive?: boolean,
 *   items?: Array<{title: string, url: string}>
 * }>} props.items - Elementos de navegación a mostrar
 * @returns {JSX.Element} Componente de navegación principal
 *
 * @example
 * const navItems = [
 *   {
 *     title: "Dashboard",
 *     url: "/dashboard",
 *     icon: HomeIcon
 *   },
 *   {
 *     title: "Administración",
 *     url: "#",
 *     icon: SettingsIcon,
 *     items: [
 *       { title: "Usuarios", url: "/admin/users" },
 *       { title: "Configuración", url: "/admin/settings" }
 *     ]
 *   }
 * ];
 *
 * <NavMain items={navItems} />
 */
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          !item.items || item.items.length === 0 ? (
            // Si el elemento no tiene subelementos, renderiza un SidebarMenuItem
            <a href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </a>
          ) : (
            // Si el elemento tiene subelementos, renderiza un Collapsible
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
