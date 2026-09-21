/**
 * ========================================================================
 * ENDPOINT API: Rutinas en 3 Bloques y Plan Semanal (app/api/rutinas/route.js)
 * ========================================================================
 * Maneja la consulta y creación de rutinas estructuradas en:
 * - Movilidad, Activación, Desarrollo
 * - Soporte para cronograma semanal multi-día (Día 1, Día 2, Día 3, Día 4)
 * - Posibilidad de elegir día actual, saltar de día o recuperar días pendientes
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Planificación semanal de demostración con 4 días completos estructurados en 3 bloques
const PLAN_SEMANAL_DEMO = [
  {
    id: 'dia-1',
    numeroDia: 1,
    nombre: 'Día 1: Tren Inferior & Fuerza Unilateral',
    enfoque: 'Dominante de rodilla, cuádriceps, glúteos y potencia reactiva',
    duracionMin: 60,
    estado: 'HOY', // 'HOY', 'COMPLETADO', 'PENDIENTE'
    bloquesCount: 3,
    ejerciciosCount: 9,
    bloques: [
      {
        id: 'b1-m-1',
        tipo: 'MOVILIDAD',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-d1-m1',
            nombre: 'Dorsiflexión de Tobillo contra pared',
            indicacionProfe: '2 series x 10 oscilaciones lentas por pierna sin despegar el talón.',
            completado: true,
            observacion: '',
            series: []
          },
          {
            id: 'ej-d1-m2',
            nombre: 'Rotaciones 90/90 de Cadera',
            indicacionProfe: '2 series x 8 transiciones manteniendo el pecho erguido.',
            completado: true,
            observacion: '',
            series: []
          },
          {
            id: 'ej-d1-m3',
            nombre: 'Gato-Camello con disociación escapular',
            indicacionProfe: '10 repeticiones fluidas al compás de la respiración.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b1-a-1',
        tipo: 'ACTIVACION',
        orden: 2,
        ejercicios: [
          {
            id: 'ej-d1-a1',
            nombre: 'Puente de Glúteo Unilateral con banda',
            indicacionProfe: '3 series x 12 reps con 2s de pausa arriba.',
            completado: false,
            observacion: '',
            series: []
          },
          {
            id: 'ej-d1-a2',
            nombre: 'Saltos reactivos al cajón bajo',
            indicacionProfe: '3 series x 4 saltos con aterrizaje silencioso.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b1-d-1',
        tipo: 'DESARROLLO',
        orden: 3,
        ejercicios: [
          {
            id: 'ej-d1-d1',
            nombre: 'Sentadilla Trasera con Barra (Back Squat)',
            indicacionProfe: '3 series x 8 reps | RIR Objetivo: 2 | Descanso: 2:30 min | Tempo 3-0-1-0',
            rirObjetivo: 2,
            observacion: 'Sentí buena profundidad en la serie 2.',
            completado: false,
            series: [
              { id: 's-1-1', numeroSerie: 1, repsRealizadas: 8, cargaKg: 80, rir: 3, rpe: 7.0, completado: true },
              { id: 's-1-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 85, rir: 2, rpe: 8.0, completado: true },
              { id: 's-1-3', numeroSerie: 3, repsRealizadas: 8, cargaKg: 85, rir: 2, rpe: 8.5, completado: false },
            ]
          },
          {
            id: 'ej-d1-d2',
            nombre: 'Empuje de Cadera con Barra (Barbell Hip Thrust)',
            indicacionProfe: '3 series x 10 reps | RIR Objetivo: 2 | Pausa 1 seg arriba',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-2-1', numeroSerie: 1, repsRealizadas: 10, cargaKg: 100, rir: 2, rpe: 8.0, completado: false },
              { id: 's-2-2', numeroSerie: 2, repsRealizadas: 10, cargaKg: 105, rir: 2, rpe: 8.5, completado: false },
              { id: 's-2-3', numeroSerie: 3, repsRealizadas: 10, cargaKg: 110, rir: 1, rpe: 9.0, completado: false },
            ]
          },
          {
            id: 'ej-d1-d3',
            nombre: 'Estocada Búlgara con Mancuernas',
            indicacionProfe: '3 series x 8 reps por pierna | RIR: 1-2 | Descanso: 90s',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-3-1', numeroSerie: 1, repsRealizadas: 8, cargaKg: 20, rir: 2, rpe: 8.0, completado: false },
              { id: 's-3-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 20, rir: 2, rpe: 8.5, completado: false },
              { id: 's-3-3', numeroSerie: 3, repsRealizadas: 8, cargaKg: 22, rir: 1, rpe: 9.0, completado: false },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dia-2',
    numeroDia: 2,
    nombre: 'Día 2: Torso & Potencia de Empuje',
    enfoque: 'Pectorales, deltoides anterior, tríceps y estabilidad escapular',
    duracionMin: 55,
    estado: 'PENDIENTE',
    bloquesCount: 3,
    ejerciciosCount: 7,
    bloques: [
      {
        id: 'b2-m-1',
        tipo: 'MOVILIDAD',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-d2-m1',
            nombre: 'Dislocaciones de Hombro con bastón o banda',
            indicacionProfe: '2 series x 12 reps controladas.',
            completado: false,
            observacion: '',
            series: []
          },
          {
            id: 'ej-d2-m2',
            nombre: 'Extensión Torácica en foam roller',
            indicacionProfe: '2 minutos manteniendo pelvis neutra.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b2-a-1',
        tipo: 'ACTIVACION',
        orden: 2,
        ejercicios: [
          {
            id: 'ej-d2-a1',
            nombre: 'Flexiones escapulares (Push-up plus)',
            indicacionProfe: '3 series x 10 reps activando serrato.',
            completado: false,
            observacion: '',
            series: []
          },
          {
            id: 'ej-d2-a2',
            nombre: 'Lanzamiento de Balón Medicinal de pecho a pared',
            indicacionProfe: '3 series x 5 lanzamientos explosivos.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b2-d-1',
        tipo: 'DESARROLLO',
        orden: 3,
        ejercicios: [
          {
            id: 'ej-d2-d1',
            nombre: 'Press de Banca Plano con Barra',
            indicacionProfe: '4 series x 6-8 reps | RIR: 2 | Descanso: 2 min',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d2-1-1', numeroSerie: 1, repsRealizadas: 8, cargaKg: 70, rir: 2, rpe: 8, completado: false },
              { id: 's-d2-1-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 70, rir: 2, rpe: 8, completado: false },
              { id: 's-d2-1-3', numeroSerie: 3, repsRealizadas: 6, cargaKg: 75, rir: 1, rpe: 9, completado: false },
              { id: 's-d2-1-4', numeroSerie: 4, repsRealizadas: 6, cargaKg: 75, rir: 1, rpe: 9.5, completado: false }
            ]
          },
          {
            id: 'ej-d2-d2',
            nombre: 'Press Militar con Mancuernas sentado',
            indicacionProfe: '3 series x 8-10 reps | RIR: 2',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d2-2-1', numeroSerie: 1, repsRealizadas: 10, cargaKg: 20, rir: 2, rpe: 8, completado: false },
              { id: 's-d2-2-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 22, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d2-2-3', numeroSerie: 3, repsRealizadas: 8, cargaKg: 22, rir: 1, rpe: 9, completado: false }
            ]
          },
          {
            id: 'ej-d2-d3',
            nombre: 'Fondos en Paralelas o Máquina Asistida',
            indicacionProfe: '3 series x 10 reps | Control en la bajada',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d2-3-1', numeroSerie: 1, repsRealizadas: 10, cargaKg: 0, rir: 2, rpe: 8, completado: false },
              { id: 's-d2-3-2', numeroSerie: 2, repsRealizadas: 10, cargaKg: 0, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d2-3-3', numeroSerie: 3, repsRealizadas: 8, cargaKg: 5, rir: 1, rpe: 9, completado: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dia-3',
    numeroDia: 3,
    nombre: 'Día 3: Cadena Posterior & Tracción',
    enfoque: 'Dorsales, trapecios, isquiosurales y estabilidad lumbar',
    duracionMin: 60,
    estado: 'PENDIENTE',
    bloquesCount: 3,
    ejerciciosCount: 7,
    bloques: [
      {
        id: 'b3-m-1',
        tipo: 'MOVILIDAD',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-d3-m1',
            nombre: 'Movilidad de Isquiosurales en decúbito supino',
            indicacionProfe: '2 series x 10 extensiones activas por pierna.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b3-a-1',
        tipo: 'ACTIVACION',
        orden: 2,
        ejercicios: [
          {
            id: 'ej-d3-a1',
            nombre: 'Face Pull con banda elástica',
            indicacionProfe: '3 series x 15 reps con 2s de retracción escapular.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b3-d-1',
        tipo: 'DESARROLLO',
        orden: 3,
        ejercicios: [
          {
            id: 'ej-d3-d1',
            nombre: 'Peso Muerto Rumano con Barra (RDL)',
            indicacionProfe: '3 series x 8 reps | RIR: 2 | Máximo foco en bisagra de cadera',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d3-1-1', numeroSerie: 1, repsRealizadas: 8, cargaKg: 90, rir: 2, rpe: 8, completado: false },
              { id: 's-d3-1-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 95, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d3-1-3', numeroSerie: 3, repsRealizadas: 8, cargaKg: 100, rir: 1, rpe: 9, completado: false }
            ]
          },
          {
            id: 'ej-d3-d2',
            nombre: 'Dominadas Pronas o Jalón al Pecho',
            indicacionProfe: '4 series x 6-8 reps | Pecho al frente sin balanceo',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d3-2-1', numeroSerie: 1, repsRealizadas: 8, cargaKg: 0, rir: 2, rpe: 8, completado: false },
              { id: 's-d3-2-2', numeroSerie: 2, repsRealizadas: 8, cargaKg: 0, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d3-2-3', numeroSerie: 3, repsRealizadas: 6, cargaKg: 0, rir: 1, rpe: 9, completado: false }
            ]
          },
          {
            id: 'ej-d3-d3',
            nombre: 'Remo Unilateral con Mancuerna apoyado en banco',
            indicacionProfe: '3 series x 10 reps por brazo | Pausa 1s en contracción',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d3-3-1', numeroSerie: 1, repsRealizadas: 10, cargaKg: 28, rir: 2, rpe: 8, completado: false },
              { id: 's-d3-3-2', numeroSerie: 2, repsRealizadas: 10, cargaKg: 30, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d3-3-3', numeroSerie: 3, repsRealizadas: 10, cargaKg: 30, rir: 1, rpe: 9, completado: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dia-4',
    numeroDia: 4,
    nombre: 'Día 4: Full Body & Acondicionamiento',
    enfoque: 'Potencia metabólica, core integral y prevención de lesiones',
    duracionMin: 50,
    estado: 'PENDIENTE',
    bloquesCount: 3,
    ejerciciosCount: 6,
    bloques: [
      {
        id: 'b4-m-1',
        tipo: 'MOVILIDAD',
        orden: 1,
        ejercicios: [
          {
            id: 'ej-d4-m1',
            nombre: 'El mayor estiramiento del mundo (World Greatest Stretch)',
            indicacionProfe: '2 series x 5 pasos por lado.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b4-a-1',
        tipo: 'ACTIVACION',
        orden: 2,
        ejercicios: [
          {
            id: 'ej-d4-a1',
            nombre: 'Kettlebell Swings rusos',
            indicacionProfe: '3 series x 10 reps explosivas.',
            completado: false,
            observacion: '',
            series: []
          }
        ]
      },
      {
        id: 'b4-d-1',
        tipo: 'DESARROLLO',
        orden: 3,
        ejercicios: [
          {
            id: 'ej-d4-d1',
            nombre: 'Paseo del Granjero Pesado (Farmer Walks)',
            indicacionProfe: '4 vueltas de 30 metros | Carga pesada con postura impecable',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d4-1-1', numeroSerie: 1, repsRealizadas: 1, cargaKg: 32, rir: 2, rpe: 8, completado: false },
              { id: 's-d4-1-2', numeroSerie: 2, repsRealizadas: 1, cargaKg: 32, rir: 2, rpe: 8.5, completado: false },
              { id: 's-d4-1-3', numeroSerie: 3, repsRealizadas: 1, cargaKg: 36, rir: 1, rpe: 9, completado: false }
            ]
          },
          {
            id: 'ej-d4-d2',
            nombre: 'Plancha Abdominal dinámica con toque de hombros',
            indicacionProfe: '3 series x 16 toques sin mover la cadera',
            rirObjetivo: 2,
            observacion: '',
            completado: false,
            series: [
              { id: 's-d4-2-1', numeroSerie: 1, repsRealizadas: 16, cargaKg: 0, rir: 2, rpe: 8, completado: false },
              { id: 's-d4-2-2', numeroSerie: 2, repsRealizadas: 16, cargaKg: 0, rir: 2, rpe: 8, completado: false },
              { id: 's-d4-2-3', numeroSerie: 3, repsRealizadas: 16, cargaKg: 0, rir: 1, rpe: 8.5, completado: false }
            ]
          }
        ]
      }
    ]
  }
];

// ------------------------------------------------------------------------
// GET: Obtener la rutina activa del alumno o un día específico del cronograma
// ------------------------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const alumnoId = searchParams.get('alumnoId');
    const diaId = searchParams.get('diaId');

    let rutina = null;

    if (alumnoId) {
      try {
        const rutinaDb = await prisma.rutina.findFirst({
          where: {
            alumnoId: alumnoId,
            estado: 'ACTIVA',
          },
          include: {
            bloques: {
              orderBy: { orden: 'asc' },
              include: {
                ejercicios: {
                  include: {
                    series: {
                      orderBy: { numeroSerie: 'asc' },
                    },
                  },
                },
              },
            },
          },
        });
        if (rutinaDb) {
          rutina = rutinaDb;
        }
      } catch (dbErr) {
        console.warn('⚠️ No se pudo consultar la rutina en MySQL (modo demo):', dbErr.message);
      }
    }

    // Si se pidió un día en particular del plan semanal
    if (diaId) {
      const diaEncontrado = PLAN_SEMANAL_DEMO.find((d) => d.id === diaId);
      if (diaEncontrado) {
        rutina = diaEncontrado;
      }
    }

    // Si aún no hay rutina seleccionada, usamos el Día 1 sugerido para hoy
    if (!rutina) {
      rutina = PLAN_SEMANAL_DEMO[0];
    }

    return NextResponse.json({
      success: true,
      rutina,
      planSemanal: PLAN_SEMANAL_DEMO.map((dia) => ({
        id: dia.id,
        numeroDia: dia.numeroDia,
        nombre: dia.nombre,
        enfoque: dia.enfoque,
        duracionMin: dia.duracionMin,
        estado: dia.estado,
        ejerciciosCount: dia.ejerciciosCount,
        bloquesCount: dia.bloquesCount,
      })),
      diaHoyId: 'dia-1',
    });
  } catch (error) {
    console.error('❌ Error al obtener la rutina:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la rutina' },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------------------------
// POST: Asignar o crear una rutina en 3 bloques (Matías)
// ------------------------------------------------------------------------
export async function POST(request) {
  try {
    const body = await request.json();
    const { alumnoId, nombre, descripcion, bloques } = body;

    if (!alumnoId || !nombre || !bloques) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios para crear la rutina' },
        { status: 400 }
      );
    }

    let nuevaRutina;
    try {
      nuevaRutina = await prisma.rutina.create({
        data: {
          alumnoId,
          entrenadorId: 'matias-coach-id',
          nombre,
          descripcion,
          bloques: {
            create: bloques.map((bloque, indexBloque) => ({
              tipo: bloque.tipo,
              orden: indexBloque + 1,
              ejercicios: {
                create: bloque.ejercicios.map((ej) => ({
                  nombre: ej.nombre,
                  indicacionProfe: ej.indicacionProfe,
                  rirObjetivo: ej.rirObjetivo ? parseInt(ej.rirObjetivo) : null,
                  series: {
                    create: (ej.series || []).map((s, idxSerie) => ({
                      numeroSerie: idxSerie + 1,
                      repsRealizadas: s.repsRealizadas ? parseInt(s.repsRealizadas) : null,
                      cargaKg: s.cargaKg ? parseFloat(s.cargaKg) : null,
                      rir: s.rir ? parseInt(s.rir) : null,
                      rpe: s.rpe ? parseFloat(s.rpe) : null,
                      completado: false,
                    })),
                  },
                })),
              },
            })),
          },
        },
        include: {
          bloques: {
            include: {
              ejercicios: {
                include: { series: true },
              },
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('⚠️ No se pudo persistir en MySQL (modo demo):', dbErr.message);
      nuevaRutina = { id: 'rutina-demo-creada-' + Date.now(), nombre, bloques };
    }

    return NextResponse.json({
      success: true,
      mensaje: '¡Rutina asignada exitosamente al alumno en 3 bloques!',
      rutina: nuevaRutina,
    });
  } catch (error) {
    console.error('❌ Error al crear la rutina:', error);
    return NextResponse.json(
      { success: false, error: 'Error al asignar la rutina' },
      { status: 500 }
    );
  }
}
