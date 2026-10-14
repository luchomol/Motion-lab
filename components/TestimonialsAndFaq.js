'use client';

/**
 * ========================================================================
 * COMPONENTE: Testimonios, Galería y FAQ (TestimonialsAndFaq.js)
 * ========================================================================
 * Integra:
 * 1. Galería visual con las fotografías oficiales del cliente.
 * 2. Casos de éxito y testimonios reales de alumnos.
 * 3. Acordeón interactivo de Preguntas Frecuentes.
 * Optimizado para alto contraste y visibilidad en celulares al sol.
 */

import { useState } from 'react';
import { Star, ChevronDown, HelpCircle, Quote, Compass } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function TestimonialsAndFaq() {
  const [preguntaAbierta, setPreguntaAbierta] = useState(0);
  const { isSunlight } = useTheme();

  const togglePregunta = (index) => {
    setPreguntaAbierta(preguntaAbierta === index ? null : index);
  };

  const testimonios = [
    {
      nombre: 'Martín Gómez',
      rol: 'Alumno Plan Premium (6 meses)',
      resultado: '-12 kg y recuperación de dolor lumbar',
      texto: 'Trabajo 8 horas sentado y sufría molestias constantes. En MOTION LAB adaptaron el entrenamiento para reforzar mi cadena posterior. Hoy entreno con pesos serios sin ningún dolor.',
    },
    {
      nombre: 'Sofía Álvarez',
      rol: 'Alumna Plan Base (4 meses)',
      resultado: 'Constancia y aumento de masa muscular',
      texto: 'Siempre dejaba el entrenamiento a las pocas semanas por falta de guía. El Plan Base me dio la estructura clara de series y ejercicios que necesitaba para ir con seguridad.',
    },
    {
      nombre: 'Diego Fernández',
      rol: 'Alumno Plan Premium (8 meses)',
      resultado: '+8 kg de masa magra y técnica limpia',
      texto: 'Las correcciones por video en WhatsApp son oro puro. Te marcan el segundo exacto y la postura para ejecutar perfecto. La dedicación del equipo es increíble.',
    },
  ];

  const faqs = [
    {
      pregunta: '¿Necesito ir a un gimnasio obligatoriamente para entrenar con MOTION LAB?',
      respuesta: 'No. Al solicitar tu plan por WhatsApp puedes especificar si tienes gimnasio o si entrenarás en casa (con mancuernas o solo con peso corporal). Adaptamos los ejercicios y la sobrecarga para que progreses al máximo con el equipo que tengas.',
    },
    {
      pregunta: '¿Qué ocurre si soy completamente principiante y nunca levanté pesas?',
      respuesta: '¡Es el mejor momento para empezar! Gran parte de nuestros alumnos comenzaron desde cero. En MOTION LAB priorizamos la técnica correcta y la higiene postural antes de subir cargas.',
    },
    {
      pregunta: '¿Cómo recibo mi rutina y plan de comidas?',
      respuesta: 'Recibirás un documento digital interactivo con videos demostrativos de cada ejercicio, cantidad exacta de series, repeticiones y descansos con cronómetro. En el Plan Premium, todo se sincroniza además mediante WhatsApp directo.',
    },
    {
      pregunta: '¿Cuál es la diferencia principal entre el Plan Base y el Plan Premium?',
      respuesta: 'El Plan Base te brinda la rutina mensual estructurada para que entrenes por tu cuenta. El Plan Premium incluye acompañamiento individual diario por WhatsApp, corrección técnica de tus videos y ajustes semanales según tu recuperación.',
    },
    {
      pregunta: '¿Cómo se realizan los pagos?',
      respuesta: 'Aceptamos transferencias bancarias locales, tarjetas y Mercado Pago / PayPal. No hay contratos de permanencia: puedes renovar mes a mes o pausar cuando quieras.',
    },
  ];

  return (
    <section id="faq" className={`py-16 md:py-24 border-t transition-colors duration-200 ${
      isSunlight ? 'bg-slate-50 border-slate-300' : 'bg-[#05070c] border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================================================================
            SECCIÓN VISUAL: ÁREAS DE ENTRENAMIENTO (FOTOGRAFÍAS OFICIALES)
           ================================================================ */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 border ${
            isSunlight ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-blue-500/10 text-sky-400 border-blue-500/20'
          }`}>
            <Compass className="w-3.5 h-3.5" />
            Ecosistema MOTION LAB
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${
            isSunlight ? 'text-[#020617]' : 'text-white'
          }`}>
            DONDE EL MOVIMIENTO SE CONVIERTE EN{' '}
            <span className={isSunlight ? 'text-blue-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300'}>
              RESULTADOS
            </span>
          </h2>
          <p className={`text-sm sm:text-base mt-2 font-medium ${
            isSunlight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Pista de velocidad, sala de fuerza, campo deportivo o en casa: adaptamos la ciencia a tu entorno.
          </p>
        </div>

        {/* GALERÍA CON LAS FOTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 md:mb-24">
          
          {/* Foto 1 */}
          <div className="relative rounded-2xl group h-64 sm:h-72">
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg transition duration-500 ${
              isSunlight ? 'opacity-60 group-hover:opacity-90' : 'opacity-30 group-hover:opacity-60'
            }`} />
            <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${
              isSunlight ? 'border-2 border-slate-300' : 'border border-slate-800'
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/track-day.jpg"
                alt="Entrenamiento en pista de atletismo - MOTION LAB"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-blue-700 text-white">
                  Velocidad & Pista
                </span>
                <h4 className="text-white font-black text-sm mt-1.5 drop-shadow">Control de Cronómetro</h4>
              </div>
            </div>
          </div>

          {/* Foto 2 */}
          <div className="relative rounded-2xl group h-64 sm:h-72">
            <div className={`absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl blur-lg transition duration-500 ${
              isSunlight ? 'opacity-60 group-hover:opacity-90' : 'opacity-30 group-hover:opacity-60'
            }`} />
            <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${
              isSunlight ? 'border-2 border-slate-300' : 'border border-slate-800'
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/track-night.jpg"
                alt="Planificación nocturna en pista - MOTION LAB"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-sky-700 text-white">
                  Capacidad Atlética
                </span>
                <h4 className="text-white font-black text-sm mt-1.5 drop-shadow">Periodización Continua</h4>
              </div>
            </div>
          </div>

          {/* Foto 3 */}
          <div className="relative rounded-2xl group h-64 sm:h-72">
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg transition duration-500 ${
              isSunlight ? 'opacity-60 group-hover:opacity-90' : 'opacity-30 group-hover:opacity-60'
            }`} />
            <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${
              isSunlight ? 'border-2 border-slate-300' : 'border border-slate-800'
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/soccer-turf.jpg"
                alt="Preparación física deportiva de campo - MOTION LAB"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-cyan-700 text-white">
                  Rendimiento Deportivo
                </span>
                <h4 className="text-white font-black text-sm mt-1.5 drop-shadow">Fuerza Aplicada al Deporte</h4>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================
            TESTIMONIOS
           ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-24">
          {testimonios.map((t, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all shadow-md ${
                isSunlight
                  ? 'bg-white border-2 border-slate-300 text-slate-900'
                  : 'bg-[#0b1220] border border-slate-800 text-white'
              }`}
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className={`w-8 h-8 mb-2 ${isSunlight ? 'text-blue-300' : 'text-sky-500/20'}`} />
                <p className={`text-sm leading-relaxed italic mb-6 font-medium ${
                  isSunlight ? 'text-slate-800' : 'text-slate-200'
                }`}>
                  &quot;{t.texto}&quot;
                </p>
              </div>

              <div className={`pt-4 border-t ${isSunlight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className={`font-black text-base ${isSunlight ? 'text-slate-950' : 'text-white'}`}>
                  {t.nombre}
                </div>
                <div className={`text-xs font-bold ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`}>
                  {t.rol}
                </div>
                <div className={`text-xs mt-1 font-bold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
                  🎯 {t.resultado}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================
            PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
           ================================================================ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 border ${
              isSunlight 
                ? 'bg-slate-200 text-slate-900 border-slate-300' 
                : 'bg-slate-900 text-slate-200 border-slate-800'
            }`}>
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Resuelve tus Dudas</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black ${isSunlight ? 'text-[#020617]' : 'text-white'}`}>
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const estaAbierta = preguntaAbierta === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl overflow-hidden transition-all ${
                    isSunlight
                      ? 'bg-white border-2 border-slate-300 shadow-sm'
                      : 'bg-[#0b1220] border border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePregunta(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none touch-target"
                  >
                    <span className={`font-black text-sm sm:text-base ${
                      isSunlight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {faq.pregunta}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isSunlight ? 'text-blue-700' : 'text-sky-400'
                      } ${estaAbierta ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {estaAbierta && (
                    <div className={`px-6 pb-6 pt-1 text-sm font-medium leading-relaxed border-t ${
                      isSunlight 
                        ? 'text-slate-800 border-slate-200' 
                        : 'text-slate-200 border-slate-800/60'
                    }`}>
                      {faq.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
