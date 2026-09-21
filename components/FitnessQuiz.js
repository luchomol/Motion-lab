'use client';

/**
 * ========================================================================
 * COMPONENTE: Cuestionario de Diagnóstico MOTION LAB (FitnessQuiz.js)
 * ========================================================================
 * Permite al alumno responder 4 preguntas clave sobre sus objetivos, nivel,
 * disponibilidad y lesiones para determinar con precisión qué plan se ajusta
 * mejor a sus requerimientos en MOTION LAB.
 * 
 * Al finalizar:
 * 1. Envía los datos por POST a /api/cuestionario para guardarlos en MySQL.
 * 2. Muestra un diagnóstico con el plan recomendado (Base o Premium).
 * 3. Genera el enlace directo a WhatsApp con el resumen de sus respuestas.
 */

import { useState } from 'react';
import { 
  Target, Dumbbell, Calendar, HeartCrack, UserCheck, 
  ArrowRight, ArrowLeft, Send, CheckCircle, Sparkles, MessageCircle 
} from 'lucide-react';

export default function FitnessQuiz() {
  const [pasoActual, setPasoActual] = useState(1);
  const [datosFormulario, setDatosFormulario] = useState({
    objetivo: '',
    nivel_experiencia: '',
    lugar_entrenamiento: '',
    dias_disponibles: 3,
    lesiones_o_dolencias: '',
    nombre: '',
    email: '',
    telefono: '',
  });

  const [cargando, setCargando] = useState(false);
  const [enviadoConExito, setEnviadoConExito] = useState(false);
  const [mensajeServidor, setMensajeServidor] = useState('');
  const [planRecomendado, setPlanRecomendado] = useState('premium');

  const actualizarCampo = (campo, valor) => {
    setDatosFormulario((previo) => ({
      ...previo,
      [campo]: valor,
    }));
  };

  const irAlSiguientePaso = () => {
    if (pasoActual === 1 && !datosFormulario.objetivo) {
      alert('Por favor selecciona tu objetivo principal antes de continuar.');
      return;
    }
    if (pasoActual === 2 && !datosFormulario.nivel_experiencia) {
      alert('Por favor selecciona tu nivel de experiencia.');
      return;
    }
    if (pasoActual === 3 && !datosFormulario.lugar_entrenamiento) {
      alert('Por favor selecciona dónde vas a entrenar.');
      return;
    }
    if (pasoActual === 4 && !datosFormulario.lesiones_o_dolencias) {
      alert('Por favor selecciona si tienes alguna molestia o selecciona "Ninguna".');
      return;
    }

    setPasoActual(pasoActual + 1);
  };

  const irAlPasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const calcularRecomendacion = () => {
    const tieneLesiones = datosFormulario.lesiones_o_dolencias !== 'Ninguna';
    const esPrincipiante = datosFormulario.nivel_experiencia === 'principiante';
    const entrenaEnCasaSinEquipo = datosFormulario.lugar_entrenamiento === 'casa_sin_equipo';

    if (tieneLesiones || entrenaEnCasaSinEquipo || esPrincipiante) {
      return 'premium';
    }
    return 'base';
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!datosFormulario.nombre || !datosFormulario.email || !datosFormulario.telefono) {
      alert('Por favor completa todos tus datos de contacto.');
      return;
    }

    setCargando(true);
    const recomendacion = calcularRecomendacion();
    setPlanRecomendado(recomendacion);

    try {
      const respuesta = await fetch('/api/cuestionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...datosFormulario,
          plan_recomendado: recomendacion,
        }),
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        setEnviadoConExito(true);
        setMensajeServidor(resultado.mensaje);
        setPasoActual(6);
      } else {
        alert('Error: ' + (resultado.error || 'No se pudo guardar la evaluación'));
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setEnviadoConExito(true);
      setPasoActual(6);
    } finally {
      setCargando(false);
    }
  };

  const generarEnlaceWhatsApp = () => {
    const telefonoEntrenador = '5493624654911';
    
    const texto = `¡Hola Equipo de MOTION LAB! 👋 Acabo de completar el test de evaluación inicial.\n\n` +
      `👤 *Nombre:* ${datosFormulario.nombre}\n` +
      `🎯 *Objetivo:* ${datosFormulario.objetivo}\n` +
      `💪 *Nivel:* ${datosFormulario.nivel_experiencia}\n` +
      `📍 *Entrenamiento:* ${datosFormulario.lugar_entrenamiento} (${datosFormulario.dias_disponibles} días/sem)\n` +
      `⚠️ *Lesiones:* ${datosFormulario.lesiones_o_dolencias}\n` +
      `⭐ *Plan sugerido:* ${planRecomendado === 'premium' ? 'Plan Premium Personalizado' : 'Plan Base'}\n\n` +
      `¿Podrían indicarme los pasos para comenzar con mi planificación en MOTION LAB?`;

    return `https://wa.me/${telefonoEntrenador}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <section id="cuestionario" className="py-24 bg-[#05070c] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Evaluación de Rendimiento
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ENCUENTRA TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">PLAN EXACTO</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Completa estas breves preguntas para calibrar el volumen, la frecuencia y el tipo de seguimiento que necesitas en MOTION LAB.
          </p>
        </div>

        {/* TARJETA DEL CUESTIONARIO */}
        <div className="bg-[#0b1220] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden card-glow">
          
          {/* BARRA DE PROGRESO */}
          {pasoActual <= 5 && (
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                <span>Paso {pasoActual} de 5</span>
                <span className="text-sky-400 font-bold">{Math.round((pasoActual / 5) * 100)}% completado</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${(pasoActual / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* PASO 1: OBJETIVO */}
          {pasoActual === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="w-7 h-7 text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  1. ¿Cuál es tu objetivo primordial hoy?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { id: 'perder_grasa', label: '🔥 Perder grasa y definir', desc: 'Bajar porcentaje graso manteniendo masa muscular' },
                  { id: 'ganar_musculo', label: '💪 Ganar masa muscular (Hipertrofia)', desc: 'Incrementar tamaño, tono y densidad muscular' },
                  { id: 'fuerza_rendimiento', label: '⚡ Rendimiento y Fuerza Atlética', desc: 'Aumentar fuerza máxima, potencia y resistencia' },
                  { id: 'salud_postura', label: '🌱 Salud articular y postura', desc: 'Fortalecer core y eliminar dolores por sedentarismo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => actualizarCampo('objetivo', item.id)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      datosFormulario.objetivo === item.id
                        ? 'bg-blue-600/15 border-sky-400 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="font-bold text-base text-white">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: NIVEL */}
          {pasoActual === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-7 h-7 text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  2. ¿Cuál es tu experiencia entrenando con cargas?
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                {[
                  { id: 'principiante', label: 'Principiante (0 a 6 meses)', desc: 'Nunca entrené en serio o estoy empezando desde cero. Desconozco la técnica correcta.' },
                  { id: 'intermedio', label: 'Intermedio (6 meses a 2 años)', desc: 'Entreno regularmente pero siento estancamiento o no tengo una progresión calculada.' },
                  { id: 'avanzado', label: 'Avanzado (+2 años constante)', desc: 'Conozco los movimientos fundamentales y busco periodización avanzada y optimización.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => actualizarCampo('nivel_experiencia', item.id)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      datosFormulario.nivel_experiencia === item.id
                        ? 'bg-blue-600/15 border-sky-400 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="font-bold text-base text-white">{item.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: LUGAR Y DÍAS */}
          {pasoActual === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-7 h-7 text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  3. ¿Dónde entrenarás y con qué frecuencia?
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Instalaciones o equipamiento disponible:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'gimnasio', label: '🏋️ Gimnasio Completo' },
                    { id: 'casa_con_equipo', label: '🏠 Casa (Mancuernas/Bandas)' },
                    { id: 'casa_sin_equipo', label: '🤸 Casa (Solo peso corporal)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => actualizarCampo('lugar_entrenamiento', item.id)}
                      className={`p-4 rounded-xl text-center border text-sm font-medium transition-all ${
                        datosFormulario.lugar_entrenamiento === item.id
                          ? 'bg-blue-600/15 border-sky-400 text-white font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Días semanales de entrenamiento disponibles: ({datosFormulario.dias_disponibles} días)
                </label>
                <div className="flex items-center gap-3">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => actualizarCampo('dias_disponibles', num)}
                      className={`w-12 h-12 rounded-xl text-base font-bold border transition-all ${
                        datosFormulario.dias_disponibles === num
                          ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-sky-400 scale-105 shadow-md shadow-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: LESIONES */}
          {pasoActual === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <HeartCrack className="w-7 h-7 text-sky-400" />
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  4. ¿Tienes alguna molestia o lesión a cuidar?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'Ninguna', label: '✅ Ninguna, estoy 100% libre de dolor' },
                  { id: 'Espalda baja / Lumbar', label: '⚠️ Molestias en zona lumbar' },
                  { id: 'Rodillas', label: '⚠️ Dolor o inflamación en rodillas' },
                  { id: 'Hombros / Cervicales', label: '⚠️ Molestia en hombro o cuello' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => actualizarCampo('lesiones_o_dolencias', item.id)}
                    className={`p-4 rounded-xl text-left border text-sm font-medium transition-all ${
                      datosFormulario.lesiones_o_dolencias === item.id
                        ? 'bg-blue-600/15 border-sky-400 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  ¿Algún otro detalle médico o articular que debamos saber? (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cirugía previa, dolor al levantar sobre la cabeza, etc."
                  value={datosFormulario.lesiones_o_dolencias === 'Ninguna' ? '' : datosFormulario.lesiones_o_dolencias}
                  onChange={(e) => actualizarCampo('lesiones_o_dolencias', e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          )}

          {/* PASO 5: CONTACTO */}
          {pasoActual === 5 && (
            <form onSubmit={manejarEnvio} className="space-y-6">
              <div className="flex items-center gap-3">
                <UserCheck className="w-7 h-7 text-sky-400" />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    5. ¿Dónde te enviamos tu diagnóstico de MOTION LAB?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ingresa tus datos para registrar tu ficha deportiva y enviarte el análisis.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={datosFormulario.nombre}
                    onChange={(e) => actualizarCampo('nombre', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={datosFormulario.email}
                    onChange={(e) => actualizarCampo('email', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    WhatsApp / Móvil *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 1234-5678"
                    value={datosFormulario.telefono}
                    onChange={(e) => actualizarCampo('telefono', e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                >
                  {cargando ? (
                    <span>Calibrando diagnóstico...</span>
                  ) : (
                    <>
                      <span>Ver mi Diagnóstico MOTION LAB</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* PASO 6: RESULTADO FINAL */}
          {pasoActual === 6 && (
            <div className="text-center py-4 space-y-6">
              
              <div className="w-16 h-16 bg-blue-500/10 text-sky-400 rounded-2xl mx-auto flex items-center justify-center border border-blue-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Evaluación MOTION LAB Calibrada
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  ¡Listo, {datosFormulario.nombre}!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mt-2">
                  Hemos procesado tus respuestas. Para tu objetivo de <span className="text-white font-semibold">{datosFormulario.objetivo.replace('_', ' ')}</span> y nivel <span className="text-white font-semibold">{datosFormulario.nivel_experiencia}</span>, este es el plan ideal:
                </p>
              </div>

              <div className={`p-6 rounded-2xl border text-left max-w-lg mx-auto ${
                planRecomendado === 'premium'
                  ? 'bg-gradient-to-b from-amber-500/10 to-[#0b1220] border-amber-500/40 shadow-xl'
                  : 'bg-gradient-to-b from-blue-500/10 to-[#0b1220] border-sky-500/40 shadow-xl'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-md ${
                    planRecomendado === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-sky-400'
                  }`}>
                    Plan Recomendado
                  </span>
                  <span className="text-xl font-black text-white">
                    {planRecomendado === 'premium' ? '$69.99/mes' : '$29.99/mes'}
                  </span>
                </div>

                <h4 className="text-xl font-extrabold text-white">
                  {planRecomendado === 'premium' ? 'Plan Premium Personalizado 1 a 1' : 'Plan Base MOTION LAB'}
                </h4>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {planRecomendado === 'premium' 
                    ? 'Por tu nivel y necesidades específicas, el Plan Premium con corrección de técnica por video y soporte diario por WhatsApp te garantizará maximizar resultados evitando lesiones.'
                    : 'Tienes una base adecuada para progresar de forma autónoma con la rutina estructurada del Plan Base y los controles mensuales.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <a
                  href={generarEnlaceWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Enviar Diagnóstico por WhatsApp</span>
                </a>
                
                <a
                  href="#planes"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                >
                  Comparativa de Planes
                </a>
              </div>

              {mensajeServidor && (
                <p className="text-[11px] text-slate-500 mt-2">
                  {mensajeServidor}
                </p>
              )}

            </div>
          )}

          {/* BOTONES ANTERIOR / SIGUIENTE */}
          {pasoActual >= 1 && pasoActual <= 4 && (
            <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8">
              <button
                type="button"
                onClick={irAlPasoAnterior}
                disabled={pasoActual === 1}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={irAlSiguientePaso}
                className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
