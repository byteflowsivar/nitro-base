import { AuthOptions, Session, User } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { AdapterUser } from 'next-auth/adapters';
import { randomUUID } from 'crypto';
import { JWT } from 'next-auth/jwt';

/**
 * Inicializar Prisma Client para interactuar con la base de datos
 * @private
 */
const prisma = new PrismaClient();

/**
 * Opciones de configuración para NextAuth
 *
 * Define la configuración completa del sistema de autenticación, incluyendo:
 * - Adaptador para Prisma (persistencia de sesiones)
 * - Proveedores de autenticación (Credentials)
 * - Páginas personalizadas
 * - Configuración de sesiones y JWT
 * - Callbacks para extender tokens y sesiones
 * - Eventos para manejar acciones específicas
 *
 * @type {AuthOptions}
 * @category Auth
 */
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // Nombre mostrado al usuario en la página de inicio de sesión
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      /**
       * Función de autorización que verifica las credenciales del usuario
       *
       * @async
       * @function authorize
       * @memberof module:next-auth/providers/credentials
       * @param {Record<string, string>} credentials - Credenciales proporcionadas por el usuario
       * @param {string} credentials.email - Email del usuario
       * @param {string} credentials.password - Contraseña del usuario
       * @returns {Promise<User>} Objeto de usuario con roles y permisos si las credenciales son válidas
       * @throws {Error} Si las credenciales son inválidas o incompletas
       */
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined
      ): Promise<User> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales incompletas');
        }

        let user;
        try {
          user = await prisma.user.findUnique({
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
        } catch (prismaError) {
          // Capturar específicamente errores de Prisma
          console.error('Error de conexión a la base de datos:', prismaError);
          throw new Error('Error de conexión a la base de datos. Intente de nuevo más tarde.');
        }

        // Verificar si el usuario existe y la contraseña es correcta
        if (!user || !user.password) {
          throw new Error('Usuario no encontrado o credenciales incorrectas');
        }

        // Verificar la contraseña
        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) {
          throw new Error('Credenciales incorrectas');
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
    signIn: '/auth/login',
    error: '/auth/error',
    // signOut: '/auth/signout',
    // newUser: '/auth/register' // Nueva página de registro si quieres personalizar
  },
  // Configurar sesión y JWT
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  // Configuración de JWT
  callbacks: {
    /**
     * Extiende el token JWT con información adicional del usuario
     *
     * @async
     * @function jwt
     * @memberof module:next-auth/callbacks
     * @param {Object} params - Parámetros para la generación del token
     * @param {JWT} params.token - Token JWT actual
     * @param {User} [params.user] - Usuario si está disponible (solo durante login)
     * @param {string} [params.trigger] - Evento que desencadenó la callback
     * @param {Object} [params.session] - Sesión actual si está disponible
     * @returns {Promise<JWT>} Token JWT extendido
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as User | AdapterUser).roles || [];
        token.permissions = (user as User | AdapterUser).permissions || [];

        // Generar un sessionToken único para este inicio de sesión
        token.sessionToken = randomUUID();

        // Calcular la fecha de expiración
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días

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
              sessionToken: token.sessionToken as string,
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
              sessionToken: token.sessionToken as string,
            },
          });
        }
      }
      return token;
    },
    /**
     * Extiende la sesión con información adicional del token JWT
     *
     * @async
     * @function session
     * @memberof module:next-auth/callbacks
     * @param {Object} params - Parámetros para la generación de la sesión
     * @param {Session} params.session - Sesión actual
     * @param {JWT} params.token - Token JWT con la información extendida
     * @returns {Promise<Session>} Sesión extendida con información adicional
     */
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
    /**
     * Manejador de evento para el cierre de sesión
     * Elimina la sesión de la base de datos cuando el usuario cierra sesión
     *
     * @async
     * @function signOut
     * @memberof module:next-auth/events
     * @param {Object} params - Parámetros del evento
     * @param {JWT} params.token - Token JWT del usuario que cierra sesión
     */
    signOut: async ({ token }) => {
      // Eliminar la sesión cuando el usuario cierra sesión
      if (token?.sessionToken) {
        await prisma.session.deleteMany({
          where: {
            sessionToken: token.sessionToken as string,
          },
        });
      }
    },
  },
  // Habilitar depuración en desarrollo
  debug: process.env.NODE_ENV === 'development',
};
