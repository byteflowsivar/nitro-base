import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticación y autorización para Next.js
 *
 * Protege rutas específicas de la aplicación verificando:
 * - Si el usuario está autenticado (mediante withAuth de next-auth)
 * - Si el usuario tiene los roles/permisos necesarios para acceder a ciertas rutas
 *
 * @function middleware
 * @category Auth
 * @param {NextRequest} req - Objeto de solicitud Next.js
 * @returns {NextResponse} Respuesta apropiada: redirigir, denegar acceso o permitir
 */
export default withAuth(
  // Función que se ejecuta después de comprobar autenticación
  function middleware(req: NextRequest) {
    const reqWithAuth = req as NextRequest & { nextauth: { token: { roles: string[] } } };

    const session = reqWithAuth.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Verificar acceso a rutas del dashboard
    if (pathname.startsWith('/dashboard')) {
      // Si el usuario no tiene rol de 'admin' o 'user' redirigir a página de acceso denegado
      const hasAccess = session?.roles?.some((role: string) => ['admin', 'user'].includes(role));

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/auth/access-denied', req.url));
      }

      // Para rutas administrativas, verificar rol específico
      if (pathname.startsWith('/dashboard/admin') && !session?.roles?.includes('admin')) {
        return NextResponse.redirect(new URL('/auth/access-denied', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Solo activar este middleware para rutas específicas
      authorized: ({ token }) => !!token,
    },
  }
);

/**
 * Configuración de rutas protegidas por el middleware
 *
 * Define qué rutas serán interceptadas por el middleware de autenticación
 *
 * @type {Object}
 * @property {string[]} matcher - Patrones de ruta que activarán el middleware
 * @category Auth
 */
export const config = {
  matcher: ['/dashboard/:path*', '/api/admin/:path*'],
};
