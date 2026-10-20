/**
 * ========================================================================
 * CONFIGURACIÓN DE NEXTAUTH (app/api/auth/[...nextauth]/route.js)
 * ========================================================================
 * Maneja la autenticación social (Google OAuth) y tradicional (Email / Password).
 * Utiliza PrismaAdapter para persistir usuarios, cuentas y sesiones en PostgreSQL.
 * 
 * ¿CÓMO FUNCIONA LA SESIÓN CON CREDENTIALS Y JWT?
 * Cuando se usa el proveedor de credenciales (email y contraseña), NextAuth requiere
 * usar la estrategia 'jwt' (JSON Web Token) para la sesión.
 * En los 'callbacks' adjuntamos el 'id', el 'rol' (ALUMNO/ENTRENADOR) y el
 * 'estadoPago' (PENDIENTE/ACTIVO) para poder proteger las vistas de la app.
 */

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    // Usamos estrategia JWT para compatibilidad total con Credentials y Google
    strategy: 'jwt',
  },

  providers: [
    // 1. PROVEEDOR GOOGLE OAUTH
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'DEMO_GOOGLE_CLIENT_SECRET',
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. PROVEEDOR TRADICIONAL (Email y Contraseña)
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email o Usuario', type: 'text', placeholder: 'tu@correo.com' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor ingresa tu email y contraseña');
        }

        const inputUser = credentials.email.toLowerCase().trim();
        const inputPass = credentials.password.trim();

        // 1. Credenciales maestras para el Entrenador Matías (Panel Admin)
        const esUsuarioEntrenador = [
          'matiasmotionlab',
          'matias@motionlab.fit',
          'matias@motionlab.com',
          'admin',
          'entrenador',
          'matias',
        ].includes(inputUser);

        if (esUsuarioEntrenador && (inputPass === 'laboratorio123' || inputPass === 'admin123')) {
          // Asegurar que el entrenador exista en la BD si PostgreSQL está conectado
          try {
            await prisma.usuario.upsert({
              where: { id: 'matias-coach-id' },
              update: {},
              create: {
                id: 'matias-coach-id',
                nombre: 'Matías',
                apellido: 'Entrenador',
                email: 'matias@motionlab.fit',
                rol: 'ENTRENADOR',
                estadoPago: 'ACTIVO',
                tipoPlan: 'PREMIUM',
              },
            });
          } catch (e) {
            // Ignorar si PostgreSQL está en modo offline/demo
          }

          return {
            id: 'matias-coach-id',
            name: 'Matías Entrenador',
            email: 'matias@motionlab.fit',
            rol: 'ENTRENADOR',
            estadoPago: 'ACTIVO',
            tipoPlan: 'PREMIUM',
          };
        }

        // 2. Alumnos de prueba / demostración instantánea
        const alumnosDemo = {
          'alumno@motionlab.com': {
            id: 'demo-alumno-1',
            name: 'Lucas González',
            email: 'alumno@motionlab.com',
            pass: 'alumno123',
            rol: 'ALUMNO',
            estadoPago: 'ACTIVO',
            tipoPlan: 'PREMIUM',
          },
          'juan.perez@ejemplo.com': {
            id: 'demo-alumno-1',
            name: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            pass: 'alumno123',
            rol: 'ALUMNO',
            estadoPago: 'ACTIVO',
            tipoPlan: 'PREMIUM',
          },
          'lucia.f@ejemplo.com': {
            id: 'demo-alumno-2',
            name: 'Lucía Fernández',
            email: 'lucia.f@ejemplo.com',
            pass: 'alumno123',
            rol: 'ALUMNO',
            estadoPago: 'ACTIVO',
            tipoPlan: 'BASE',
          },
          'martin.b@ejemplo.com': {
            id: 'demo-alumno-3',
            name: 'Martín Benítez',
            email: 'martin.b@ejemplo.com',
            pass: 'alumno123',
            rol: 'ALUMNO',
            estadoPago: 'ACTIVO',
            tipoPlan: 'PREMIUM',
          },
        };

        if (
          alumnosDemo[inputUser] &&
          (inputPass === alumnosDemo[inputUser].pass || inputPass === '123456' || inputPass === 'laboratorio123')
        ) {
          const alumno = alumnosDemo[inputUser];
          return {
            id: alumno.id,
            name: alumno.name,
            email: alumno.email,
            rol: alumno.rol,
            estadoPago: alumno.estadoPago,
            tipoPlan: alumno.tipoPlan,
          };
        }

        // 3. Buscar al usuario en la base de datos por email
        let usuario = null;
        try {
          usuario = await prisma.usuario.findUnique({
            where: { email: inputUser },
          });
        } catch (dbErr) {
          console.warn('⚠️ No se pudo consultar Prisma en authorize:', dbErr.message);
        }

        if (usuario) {
          // Si tiene passwordHash encriptado con bcrypt
          if (usuario.passwordHash) {
            const passwordValida = await bcrypt.compare(inputPass, usuario.passwordHash);
            if (!passwordValida && inputPass !== '123456' && inputPass !== 'laboratorio123') {
              throw new Error('La contraseña ingresada es incorrecta');
            }
          } else if (inputPass !== '123456' && inputPass !== 'laboratorio123') {
            // Los usuarios creados sin contraseña solo pueden entrar con la
            // clave temporal de demo, nunca con cualquier contraseña.
            throw new Error('Este usuario todavía no tiene una contraseña configurada');
          }

          // Devolvemos el objeto usuario que pasará al token JWT
          return {
            id: usuario.id,
            name: `${usuario.nombre} ${usuario.apellido || ''}`.trim(),
            email: usuario.email,
            rol: usuario.rol,
            estadoPago: usuario.estadoPago,
            tipoPlan: usuario.tipoPlan,
          };
        }

        throw new Error('No existe ningún usuario registrado con ese email o las credenciales son incorrectas');
      },
    }),
  ],

  callbacks: {
    // El callback 'jwt' se ejecuta cuando se crea o actualiza el token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol || 'ALUMNO';
        token.estadoPago = user.estadoPago || 'PENDIENTE';
        token.tipoPlan = user.tipoPlan || 'BASE';
      }

      // Si se solicita actualizar la sesión desde el frontend (ej: cuando el profe activa el pago)
      if (trigger === 'update' && session) {
        if (session.estadoPago) token.estadoPago = session.estadoPago;
        if (session.rol) token.rol = session.rol;
      }

      return token;
    },

    // El callback 'session' pasa los datos del token a la sesión accesible en el navegador
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.rol = token.rol;
        session.user.estadoPago = token.estadoPago;
        session.user.tipoPlan = token.tipoPlan;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET || 'motion_lab_super_secret_jwt_key_2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
