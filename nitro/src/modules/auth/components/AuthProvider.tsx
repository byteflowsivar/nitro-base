'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

/**
 * Interfaz para las propiedades del AuthProvider
 *
 * @interface AuthProviderProps
 * @category Auth
 */
interface AuthProviderProps {
  /** Componentes hijos que serán envueltos por el provider */
  children: React.ReactNode;
  /** Objeto de sesión actual (opcional) */
  session?: Session | null;
}

/**
 * Componente proveedor de autenticación
 *
 * Envuelve la aplicación con el SessionProvider de NextAuth para gestionar
 * el estado de autenticación y proporcionar acceso a la sesión del usuario
 * en toda la aplicación.
 *
 * @component AuthProvider
 * @category Auth
 * @param {AuthProviderProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente SessionProvider de NextAuth
 *
 * @example
 * ```tsx
 * // Uso en layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="es">
 *       <body>
 *         <AuthProvider>{children}</AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
