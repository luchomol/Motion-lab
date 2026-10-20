/**
 * ========================================================================
 * ENDPOINT API: Lista de Alumnos para el Entrenador (app/api/entrenador/alumnos/route.js)
 * ========================================================================
 * Permite a Matías consultar todos los alumnos registrados, su perfil deportivo,
 * plan seleccionado (BASE / PREMIUM) y estado de pago (PENDIENTE / ACTIVO).
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { obtenerCheckinsDeStore, obtenerDetalleSesionesDeStore } from '@/lib/fallbackStore';
import { ALUMNOS_DEMO } from '@/lib/demoAlumnos';

function calcularBienestar(checkins) {
  if (!checkins || checkins.length === 0) {
    return { alertaBienestar: 'VERDE', consecutivosFatiga: 0 };
  }

  const ultimo = checkins[0]; // El check-in más reciente

  // Fatiga crítica/extrema en la última sesión:
  // 1. Energía 1 (Agotado/a)
  // 2. Ánimo 1 (Muy estresado)
  // 3. Post-entreno: RPE >= 9 con ánimo peor
  const fatigaExtremaUltimo =
    (ultimo.energiaInicial !== null && ultimo.energiaInicial !== undefined && Number(ultimo.energiaInicial) <= 1) ||
    (ultimo.animoInicial !== null && ultimo.animoInicial !== undefined && Number(ultimo.animoInicial) <= 1) ||
    (ultimo.esfuerzoFinal !== null && ultimo.esfuerzoFinal !== undefined && Number(ultimo.esfuerzoFinal) >= 9 && Number(ultimo.animoFinal) === 1);

  // Fatiga moderada en la última sesión:
  // Energía 2 (Bajo), Ánimo 2 (Desmotivado), Descanso 'Mal', o RPE >= 9
  const fatigaModeradaUltimo =
    (ultimo.energiaInicial !== null && ultimo.energiaInicial !== undefined && Number(ultimo.energiaInicial) <= 2) ||
    (ultimo.animoInicial !== null && ultimo.animoInicial !== undefined && Number(ultimo.animoInicial) <= 2) ||
    ultimo.descansoInicial === 'Mal' ||
    (ultimo.esfuerzoFinal !== null && ultimo.esfuerzoFinal !== undefined && Number(ultimo.esfuerzoFinal) >= 9) ||
    ultimo.desahogoFinal === 'No, sigo a mil';

  // Conteo de sesiones consecutivas con fatiga
  let consecutivos = 0;
  for (const c of checkins) {
    const esFatiga =
      (c.energiaInicial !== null && c.energiaInicial !== undefined && Number(c.energiaInicial) <= 2) ||
      (c.animoInicial !== null && c.animoInicial !== undefined && Number(c.animoInicial) <= 2) ||
      c.descansoInicial === 'Mal' ||
      (c.esfuerzoFinal !== null && c.esfuerzoFinal !== undefined && Number(c.esfuerzoFinal) >= 9);

    if (esFatiga) {
      consecutivos++;
    } else {
      break;
    }
  }

  if (fatigaExtremaUltimo || consecutivos >= 2) {
    return { alertaBienestar: 'ROJA', consecutivosFatiga: Math.max(consecutivos, 1) };
  } else if (fatigaModeradaUltimo || consecutivos >= 1) {
    return { alertaBienestar: 'AMARILLA', consecutivosFatiga: consecutivos };
  } else {
    return { alertaBienestar: 'VERDE', consecutivosFatiga: 0 };
  }
}

export async function GET() {
  try {
    let alumnos = [];

    try {
      alumnos = await prisma.usuario.findMany({
        where: { rol: 'ALUMNO' },
        include: {
          perfilDeportivo: true,
          rutinasComoAlumno: {
            select: { 
              id: true, 
              nombre: true, 
              fechaAsignada: true,
              estado: true,
              energiaInicial: true,
              animoInicial: true,
              descansoInicial: true,
              animoFinal: true,
              esfuerzoFinal: true,
              desahogoFinal: true,
              fechaCompletada: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Mapear checkins y calcular alertas para alumnos de base de datos
      alumnos = alumnos.map((alumno) => {
        const rutinas = alumno.rutinasComoAlumno || [];
        const checkinsRutinas = rutinas
          .filter((r) => r.energiaInicial || r.animoInicial || r.descansoInicial)
          .map((r, i) => ({
            clase: r.nombre || `Sesión ${i + 1}`,
            fecha: r.fechaCompletada ? new Date(r.fechaCompletada).toISOString().split('T')[0] : 'Reciente',
            energiaInicial: r.energiaInicial,
            animoInicial: r.animoInicial,
            descansoInicial: r.descansoInicial,
            esfuerzoFinal: r.esfuerzoFinal,
            animoFinal: r.animoFinal,
            desahogoFinal: r.desahogoFinal,
          }));

        const checkinsStore = obtenerCheckinsDeStore(alumno.id);
        const checkinsCompletos = [...checkinsStore, ...checkinsRutinas];
        const { alertaBienestar, consecutivosFatiga } = calcularBienestar(checkinsCompletos);

        // Sesiones/días que el alumno ya completó en MySQL (persistidas)
        const rutinasCompletadasIds = rutinas
          .filter((r) => r.fechaCompletada)
          .map((r) => r.id);

        return {
          ...alumno,
          alertaBienestar,
          consecutivosFatiga,
          checkins: checkinsCompletos,
          rutinasCompletadasIds,
        };
      });
    } catch (dbErr) {
      console.warn('⚠️ No se pudo consultar alumnos en MySQL (modo demo):', dbErr.message);
    }

    // Datos de demostración si la base de datos está vacía o sin inicializar
    if (!alumnos || alumnos.length === 0) {
      alumnos = ALUMNOS_DEMO;
    }

    // Sincronizar check-ins y sesiones completadas desde el almacén en memoria (fallbackStore)
    alumnos = alumnos.map((alumno) => {
      const checkinsStore = obtenerCheckinsDeStore(alumno.id);
      const sesionesStore = obtenerDetalleSesionesDeStore(alumno.id);

      // Sesiones completadas = historial base (demo o MySQL) + sesiones registradas
      // en memoria al finalizar cada día, evitando duplicar la misma rutina/día.
      const completadasExtraDB = (alumno.rutinasCompletadasIds || []).filter(
        (id) => !sesionesStore.rutinas.includes(id)
      ).length;
      const sesionesCompletadas =
        Number(alumno.sesionesBaseline || 0) + sesionesStore.total + completadasExtraDB;

      if (checkinsStore && checkinsStore.length > 0) {
        // Filtrar duplicados por id si ya existen
        const existentesIds = new Set((alumno.checkins || []).map((c) => c.id || c.clase));
        const nuevosDeStore = checkinsStore.filter((c) => !existentesIds.has(c.id));
        const checkinsCombinados = [...nuevosDeStore, ...(alumno.checkins || [])];
        const { alertaBienestar, consecutivosFatiga } = calcularBienestar(checkinsCombinados);

        return {
          ...alumno,
          alertaBienestar,
          consecutivosFatiga,
          checkins: checkinsCombinados,
          sesionesCompletadas,
        };
      }
      return { ...alumno, sesionesCompletadas };
    });

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

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      nombre, apellido, email, password, whatsapp, peso, altura, lesiones, estadoPago, tipoPlan,
      objetivo, deporte, club, nivel, focos, disponibilidad, rmEstimado, puntosDebiles
    } = data;

    // Generar email único si no se provee
    const finalEmail = email || `alumno-${Date.now()}@motionlab.local`;
    
    let passwordHash = null;
    if (password && password.trim() !== '') {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const nuevoAlumno = await prisma.usuario.create({
      data: {
        nombre: nombre || 'Sin Nombre',
        apellido: apellido || '',
        email: finalEmail.toLowerCase().trim(),
        passwordHash,
        whatsapp,
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        lesiones,
        estadoPago: estadoPago || 'PENDIENTE',
        tipoPlan: tipoPlan || 'BASE',
        rol: 'ALUMNO',
        perfilDeportivo: {
          create: {
            objetivo: objetivo || 'Rendimiento',
            deporte: deporte || 'Fitness General',
            club: club === 'true' || club === true,
            nivel: nivel || 'Principiante',
            focos: focos || 'General',
            disponibilidad: disponibilidad || '3 días',
            rmEstimado,
            puntosDebiles
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

    return NextResponse.json({ success: true, alumno: nuevoAlumno });
  } catch (error) {
    console.error('Error al crear alumno:', error);
    return NextResponse.json({ success: false, error: 'Error al crear el alumno' }, { status: 500 });
  }
}

