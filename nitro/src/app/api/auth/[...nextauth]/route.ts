import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';


/**
 * Manipulador para las solicitudes de autenticación de NextAuth
 *
 * @const {Object} handler
 * @category Auth
 */
const handler = NextAuth(authOptions);

/**
 * Exportar manipuladores GET y POST para manejar solicitudes HTTP
 *
 * @exports GET - Manipulador para solicitudes GET de autenticación
 * @exports POST - Manipulador para solicitudes POST de autenticación
 * @category Auth
 */
export { handler as GET, handler as POST };
