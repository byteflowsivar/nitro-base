import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware para autenticación y autorización
export default withAuth(
    // Función que se ejecuta después de comprobar autenticación
    function middleware(req: NextRequest) {
        const session = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Verificar acceso a rutas del panel (dashboard)
        if (pathname.startsWith('/dashboard')) {
            // Si el usuario no tiene rol de 'admin' o 'user' redirigir a página de acceso denegado
            const hasAccess = session?.roles?.some(role => ['admin', 'user'].includes(role));

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
            authorized: ({ token }) => !!token
        },
    }
);

// Configurar las rutas que se protegerán con este middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/admin/:path*'
    ]
};