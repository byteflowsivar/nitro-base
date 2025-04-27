import 'next-auth';
import 'next-auth/jwt';

/**
 * Extensión de tipos para NextAuth
 * Este archivo amplía las interfaces de NextAuth para incluir propiedades personalizadas
 * como roles y permisos necesarios para la gestión de autorización
 *
 * @module next-auth
 * @category Auth
 */

// Extender la interfaz de Session para incluir roles y permisos
declare module 'next-auth' {
  /**
   * Extiende la interfaz User de NextAuth
   *
   * @interface User
   * @memberof module:next-auth
   * @category Auth
   */
  interface User {
    /** Identificador único del usuario */
    id: string;
    /** Rol principal del usuario (legacy) */
    role?: string;
    /** Lista de roles asignados al usuario */
    roles?: string[];
    /** Lista de permisos específicos del usuario */
    permissions?: string[];
  }

  /**
   * Extiende la interfaz Session de NextAuth
   *
   * @interface Session
   * @memberof module:next-auth
   * @category Auth
   */
  interface Session {
    /** Información del usuario en sesión */
    user: {
      /** Identificador único del usuario */
      id: string;
      /** Nombre del usuario */
      name?: string | null;
      /** Email del usuario */
      email?: string | null;
      /** URL de la imagen de perfil */
      image?: string | null;
      /** Rol principal del usuario (legacy) */
      role?: string;
      /** Lista de roles asignados al usuario */
      roles?: string[];
      /** Lista de permisos específicos del usuario */
      permissions?: string[];
    };
  }
}

// Extender la interfaz JWT para incluir roles y permisos
declare module 'next-auth/jwt' {
  /**
   * Extiende la interfaz JWT de NextAuth
   *
   * @interface JWT
   * @memberof module:next-auth/jwt
   * @category Auth
   */
  interface JWT {
    /** Identificador único del usuario */
    id: string;
    /** Rol principal del usuario (legacy) */
    role?: string;
    /** Lista de roles asignados al usuario */
    roles?: string[];
    /** Lista de permisos específicos del usuario */
    permissions?: string[];
  }
}
