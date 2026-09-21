/**
 * ========================================================================
 * RUTA DE API: /api/cuestionario (app/api/cuestionario/route.js)
 * ========================================================================
 * En Next.js (App Router), los archivos 'route.js' dentro de la carpeta 'api'
 * actúan como un backend (servidor).
 * 
 * Esta función maneja las peticiones HTTP tipo "POST", que es cuando
 * el formulario del frontend nos envía los datos del alumno y sus respuestas
 * para guardarlos en la base de datos MySQL.
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    // 1. Extraer los datos enviados desde el frontend en formato JSON
    const body = await request.json();
    const {
      nombre,
      email,
      telefono,
      objetivo,
      nivel_experiencia,
      lugar_entrenamiento,
      dias_disponibles,
      lesiones_o_dolencias,
      plan_recomendado,
    } = body;

    // 2. Validación básica de campos obligatorios
    // Verificamos que el alumno haya ingresado al menos nombre, contacto y respuestas clave
    if (!nombre || !email || !telefono || !objetivo || !nivel_experiencia) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Faltan campos obligatorios para procesar la evaluación' 
        },
        { status: 400 } // Código HTTP 400: Bad Request (Petición incorrecta)
      );
    }

    // 3. Guardado en la Base de Datos MySQL
    let alumnoId = null;
    let guardadoEnDb = false;

    try {
      // Paso A: Insertar al alumno en la tabla 'alumnos'
      const resultadoAlumno = await query(
        `INSERT INTO alumnos (nombre, email, telefono) VALUES (?, ?, ?)`,
        [nombre.trim(), email.trim().toLowerCase(), telefono.trim()]
      );

      // insertId contiene el 'id' autoincrementable que MySQL le asignó a este alumno
      alumnoId = resultadoAlumno.insertId;

      // Paso B: Insertar la evaluación en la tabla 'evaluaciones' vinculándola con 'alumno_id'
      await query(
        `INSERT INTO evaluaciones 
          (alumno_id, objetivo, nivel_experiencia, lugar_entrenamiento, dias_disponibles, lesiones_o_dolencias, plan_recomendado) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          alumnoId,
          objetivo,
          nivel_experiencia,
          lugar_entrenamiento || 'gimnasio',
          Number(dias_disponibles) || 3,
          lesiones_o_dolencias || 'Ninguna especificada',
          plan_recomendado || 'base',
        ]
      );

      guardadoEnDb = true;
      console.log(`✅ Alumno guardado con éxito en MySQL (ID: ${alumnoId})`);
    } catch (dbError) {
      // Si MySQL aún no está instalado o configurado en local, no rompemos la experiencia.
      // Mostramos un aviso en consola y dejamos que el usuario pruebe la interfaz en modo demo.
      console.warn('⚠️ No se pudo conectar con MySQL. Operando en modo DEMO:', dbError.message);
    }

    // 4. Responder al frontend con un mensaje de éxito (Código 200 OK)
    return NextResponse.json({
      success: true,
      mensaje: guardadoEnDb 
        ? '¡Evaluación y alumno registrados exitosamente en la base de datos!' 
        : '¡Evaluación procesada con éxito! (Modo de prueba sin conexión a MySQL activa)',
      alumnoId: alumnoId || 'demo-123',
      datos: {
        nombre,
        plan_recomendado,
      },
      guardadoEnDb,
    });

  } catch (error) {
    // Si ocurre un error imprevisto en el servidor, lo capturamos aquí
    console.error('❌ Error en el endpoint /api/cuestionario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ocurrió un error al procesar el cuestionario en el servidor' 
      },
      { status: 500 } // Código HTTP 500: Error interno del servidor
    );
  }
}
