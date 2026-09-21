/**
 * ========================================================================
 * ENDPOINT API: Lista de Alumnos para el Entrenador (app/api/entrenador/alumnos/route.js)
 * ========================================================================
 * Permite a Matías consultar todos los alumnos registrados, su perfil deportivo,
 * plan seleccionado (BASE / PREMIUM) y estado de pago (PENDIENTE / ACTIVO).
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let alumnos = [];

    try {
      alumnos = await prisma.usuario.findMany({
        where: { rol: 'ALUMNO' },
        include: {
          perfilDeportivo: true,
          rutinasComoAlumno: {
            where: { estado: 'ACTIVA' },
            select: { id: true, nombre: true, fechaAsignada: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('⚠️ No se pudo consultar alumnos en MySQL (modo demo):', dbErr.message);
    }

    // Datos de demostración si la base de datos está vacía o sin inicializar
    if (!alumnos || alumnos.length === 0) {
      alumnos = [
        {
          id: 'demo-alumno-1',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@ejemplo.com',
          whatsapp: '+54 9 11 5555-0101',
          peso: 78.5,
          altura: 178,
          lesiones: 'Molestia leve en rodilla derecha al bajar de 90°',
          estadoPago: 'PENDIENTE',
          tipoPlan: 'PREMIUM',
          createdAt: new Date().toISOString(),
          perfilDeportivo: {
            objetivo: 'Rendimiento',
            deporte: 'Fútbol',
            club: true,
            nivel: 'Intermedio',
            focos: 'Fuerza, Velocidad',
            disponibilidad: '4 días',
            rmEstimado: 'Sentadilla 110kg, Banco 85kg',
            puntosDebiles: 'Potencia de arranque y estabilidad unilateral',
          },
          rutinasComoAlumno: [],
        },
        {
          id: 'demo-alumno-2',
          nombre: 'Lucía',
          apellido: 'Fernández',
          email: 'lucia.f@ejemplo.com',
          whatsapp: '+54 9 11 5555-0202',
          peso: 62.0,
          altura: 165,
          lesiones: 'Sin lesiones',
          estadoPago: 'ACTIVO',
          tipoPlan: 'BASE',
          createdAt: new Date().toISOString(),
          perfilDeportivo: {
            objetivo: 'Estética',
            deporte: 'Fitness General',
            club: false,
            nivel: 'Principiante',
            focos: 'Fuerza, Resistencia',
            disponibilidad: '3 días',
            rmEstimado: null,
            puntosDebiles: null,
          },
          rutinasComoAlumno: [
            {
              id: 'rutina-demo-1',
              nombre: 'Mesociclo 1 - Adaptación Anatómica',
              fechaAsignada: new Date().toISOString(),
            },
          ],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      total: alumnos.length,
      alumnos,
    });
  } catch (error) {
    console.error('❌ Error al obtener alumnos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener lista de alumnos' },
      { status: 500 }
    );
  }
}
