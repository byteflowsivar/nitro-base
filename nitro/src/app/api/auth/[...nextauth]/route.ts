import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { AuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";
import { randomUUID } from "crypto";

// Inicializar Prisma Client
const prisma = new PrismaClient();

/**
 * Opciones de configuración para NextAuth
 */
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // Nombre mostrado al usuario en la página de inicio de sesión
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales incompletas");
                }

                // Buscar el usuario por email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        roles: {
                            include: {
                                role: {
                                    include: {
                                        permissions: true,
                                    },
                                },
                            },
                        },
                    },
                });

                // Verificar si el usuario existe y la contraseña es correcta
                if (!user || !user.password) {
                    throw new Error("Usuario no encontrado o credenciales incorrectas");
                }

                // Verificar la contraseña
                const passwordMatch = await compare(credentials.password, user.password);
                if (!passwordMatch) {
                    throw new Error("Credenciales incorrectas");
                }

                // Extraer los roles y permisos para incluirlos en la sesión
                const roles = user.roles.map((userRole) => userRole.role.name);
                const permissions = user.roles
                    .flatMap((userRole) => userRole.role.permissions)
                    .map((permission) => permission.name);

                // Devolver el usuario con roles y permisos
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    roles,
                    permissions,
                };
            },
        }),
    ],
    // Configurar páginas personalizadas
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
        signOut: '/auth/signout',
        // newUser: '/auth/register' // Nueva página de registro si quieres personalizar
    },
    // Configurar sesión y JWT
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    // Configuración de JWT
    callbacks: {
        // Extender el token con información adicional del usuario
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.roles = (user as any).roles || [];
                token.permissions = (user as any).permissions || [];

                // Generar un sessionToken único para este inicio de sesión
                token.sessionToken = randomUUID();

                // Calcular la fecha de expiración
                const expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días

                // Verificar si ya existe una sesión para este usuario
                const existingSession = await prisma.session.findFirst({
                    where: {
                        userId: user.id,
                        expires: {
                            gte: new Date(), // Asegurarse de que la sesión no haya expirado
                        },
                    },
                });

                // Registrar una nueva sesión solo si no existe una activa
                if (!existingSession) {
                    await prisma.session.create({
                        data: {
                            sessionToken: token.sessionToken,
                            userId: user.id,
                            expires: expiryDate,
                        },
                    });
                } else {
                    // Reutilizar el sessionToken existente
                    token.sessionToken = existingSession.sessionToken;
                }
            }

            // Si es una actualización de sesión (como en un cierre de sesión)
            if (trigger === 'update' && session?.terminateSession) {
                // Eliminar la sesión de la base de datos
                if (token.sessionToken) {
                    await prisma.session.deleteMany({
                        where: {
                            sessionToken: token.sessionToken as string
                        }
                    });
                }
            }
            return token;
        },
        // Extender la sesión con información adicional del token
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.roles = token.roles as string[];
                session.user.permissions = token.permissions as string[];
            }
            return session;
        },
    },
    // Evento para manejar el cierre de sesión
    events: {
        signOut: async ({ token }) => {

            // Eliminar la sesión cuando el usuario cierra sesión
            if (token?.sessionToken) {
                await prisma.session.deleteMany({
                    where: {
                        sessionToken: token.sessionToken as string
                    }
                });
            }
        }
    },
    // Habilitar depuración en desarrollo
    debug: process.env.NODE_ENV === "development",
};

// Manipulador para las solicitudes de autenticación
const handler = NextAuth(authOptions);

// Exportar manipuladores GET y POST
export { handler as GET, handler as POST };