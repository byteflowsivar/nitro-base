import { User, Team, NavItem } from '@/types/sidebar';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Map,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

export const defaultUser: User = {
  name: 'Usuario Administrador',
  email: 'admin@ejemplo.com',
  avatar: '/avatars/shadcn.jpg',
};

export const teams: Team[] = [
  {
    name: 'Nitro Labs',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
  },
  {
    name: 'Acme Corp.',
    logo: AudioWaveform,
    plan: 'Startup',
  },
  {
    name: 'Evil Corp.',
    logo: Command,
    plan: 'Free',
  },
];

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Map,
  },
  {
    title: 'Administración',
    url: '#',
    icon: SquareTerminal,
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/admin',
        permissionRequired: 'admin.dashboard',
      },
      {
        title: 'Usuarios',
        url: '#',
        permissionRequired: 'users.manage',
      },
      {
        title: 'Roles',
        url: '#',
        permissionRequired: 'roles.manage',
      },
      {
        title: 'Configuraciones',
        url: '#',
        permissionRequired: 'settings.manage',
      },
    ],
  },
  {
    title: 'Models',
    url: '#',
    icon: Bot,
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
  {
    title: 'Documentation',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Introduction',
        url: '#',
      },
      {
        title: 'Get Started',
        url: '#',
      },
      {
        title: 'Tutorials',
        url: '#',
      },
      {
        title: 'Changelog',
        url: '#',
      },
    ],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Team',
        url: '#',
      },
      {
        title: 'Billing',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
    ],
  },
];
