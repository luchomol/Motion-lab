import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  try {
    const alumnoId = params.id;
    const data = await req.json();

    const {
      nombre, apellido, email, whatsapp, peso, altura, lesiones, estadoPago, tipoPlan,
      objetivo, deporte, club, nivel, focos, disponibilidad, rmEstimado, puntosDebiles
    } = data;

    // Actualizar usuario
    const alumnoActualizado = await prisma.usuario.update({
      where: { id: alumnoId },
      data: {
        nombre,
        apellido,
        email,
        whatsapp,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        lesiones,
        estadoPago,
        tipoPlan,
        perfilDeportivo: {
          upsert: {
            create: {
              objetivo: objetivo || 'Rendimiento',
              deporte: deporte || 'Fitness General',
              club: club || false,
              nivel: nivel || 'Principiante',
              focos: focos || 'General',
              disponibilidad: disponibilidad || '3 días',
              rmEstimado,
              puntosDebiles
            },
            update: {
              objetivo,
              deporte,
              club,
              nivel,
              focos,
              disponibilidad,
              rmEstimado,
              puntosDebiles
            }
          }
        }
      },
      include: {
        perfilDeportivo: true,
        rutinasComoAlumno: {
          where: { estado: 'ACTIVA' },
          select: { id: true, nombre: true, fechaAsignada: true },
        },
      }
    });

    return NextResponse.json({ success: true, alumno: alumnoActualizado });
  } catch (error) {
    console.error('Error al actualizar alumno:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar el alumno' }, { status: 500 });
  }
}
