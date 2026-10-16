'use client';

/**
 * ========================================================================
 * COMPONENTE: Sección de Salud Mental & Bienestar (MentalHealthSection.js)
 * ========================================================================
 * Sección informativa para la landing page de MOTION LAB:
 * 1. Educación sobre hábitos que cuidan la mente del atleta (respiración,
 *    sueño, manejo del estrés pre-competencia).
 * 2. Señales de alerta que no conviene normalizar.
 * 3. Recursos de ayuda y contacto directo con Matías.
 *
 * Soporta Modo Soleado de Alto Contraste y Modo Noche.
 */

import { Brain, HeartHandshake, Moon, Wind, AlertTriangle, MessageCircle, LifeBuoy, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function MentalHealthSection() {
  const { isSunlight } = useTheme();

  const numeroWhatsApp = '5493624654911';
  const mensajePredeterminado = encodeURIComponent(
    '¡Hola Coach Matías! Vi la sección de Salud Mental en la web y quería hablar con vos.'
  );
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajePredeterminado}`;

  const tarjetas = [
    {
      icono: Wind,
      emoji: '😮‍💨',
      titulo: 'Respiración 4-7-8',
      texto:
        'Antes de entrenar o antes de dormir: inhalá 4 segundos, sostené el aire 7 segundos y exhalá lento en 8. Repetí 4 rondas. Baja el pulso, calma el sistema nervioso y mejora tu enfoque.',
    },
    {
      icono: Moon,
      emoji: '😴',
      titulo: 'Sueño: el mejor recuperador',
      texto:
        'Dormir entre 7 y 9 horas es el suplemento más potente que existe. Sin descanso no hay adaptación, no hay fuerza nueva y las emociones se desordenan. Cuidá tus horarios y alejá las pantallas una hora antes de dormir.',
    },
    {
      icono: Brain,
      emoji: '🧗',
      titulo: 'Estrés pre-competencia',
      texto:
        'Sentir nervios antes de rendir es normal: es tu cuerpo activándose. Enfocate en lo que SÍ controlás (tu rutina, tu respiración, tu preparación) y visualizá el movimiento, no el resultado. Un plan claro calma una cabeza inquieta.',
    },
    {
      icono: AlertTriangle,
      emoji: '🚩',
      titulo: 'Señales que no hay que ignorar',
      texto:
        'Irritabilidad constante, apatía, no poder dormir varias noches seguidas, perder las ganas de todo o sentirse vacío/a. No es "flojera" ni "exageración": es tu mente pidiendo atención. Hablarlo a tiempo también es entrenar.',
    },
  ];

  return (
    <section
      id="salud-mental"
      className={`py-16 md:py-24 border-t transition-colors duration-200 ${
        isSunlight ? 'bg-white border-slate-300' : 'bg-[#05070c] border-slate-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
            isSunlight
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Bienestar Integral</span>
          </div>

          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
            isSunlight ? 'text-[#020617]' : 'text-white'
          }`}>
            TU MENTE{' '}
            <span className={isSunlight ? 'text-emerald-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-300'}>
              TAMBIÉN ENTRENA
            </span>
          </h2>

          <p className={`mt-4 text-base font-medium leading-relaxed ${
            isSunlight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            En MOTION LAB medimos cargas, series y RIR... pero el rendimiento de verdad se sostiene sobre
            la cabeza. La salud mental es una parte más del plan: se cuida, se entrena y también se habla.
          </p>
        </div>

        {/* TARJETAS INFORMATIVAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12">
          {tarjetas.map((t) => {
            const Icono = t.icono;
            return (
              <div
                key={t.titulo}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  isSunlight
                    ? 'bg-slate-50 border-2 border-slate-300 shadow-sm hover:border-emerald-400'
                    : 'bg-[#0c1322] border border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    isSunlight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <Icono className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-black text-sm sm:text-base flex items-center gap-2 ${
                      isSunlight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>{t.emoji}</span>
                      <span>{t.titulo}</span>
                    </h3>
                    <p className={`text-xs sm:text-sm font-medium mt-2 leading-relaxed ${
                      isSunlight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {t.texto}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BLOQUE DE AYUDA Y RECURSOS */}
        <div className={`rounded-3xl border-2 p-6 sm:p-8 ${
          isSunlight
            ? 'bg-emerald-50 border-emerald-400 shadow-md'
            : 'bg-gradient-to-br from-emerald-950/40 via-[#0a1818] to-[#05070c] border-emerald-500/40 shadow-2xl'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3 ${
                isSunlight ? 'text-emerald-800' : 'text-emerald-400'
              }`}>
                <LifeBuoy className="w-4 h-4" />
                <span>Si estás pasando un momento difícil</span>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${
                isSunlight ? 'text-slate-950' : 'text-white'
              }`}>
                Pedir ayuda no es debilidad: es parte del plan
              </h3>

              <p className={`text-xs sm:text-sm font-medium mt-3 leading-relaxed ${
                isSunlight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                No estás solo/a. Si sentís que la mochila pesa demasiado, hablalo con alguien de confianza
                o con un profesional de la salud mental. En Argentina podés llamar a la{' '}
                <strong className={isSunlight ? 'text-emerald-800' : 'text-emerald-300'}>Línea 135</strong>{' '}
                (atención en crisis, las 24 hs) o al <strong className={isSunlight ? 'text-emerald-800' : 'text-emerald-300'}>911</strong>{' '}
                ante una emergencia.
              </p>

              <p className={`text-[11px] font-semibold mt-3 ${isSunlight ? 'text-slate-500' : 'text-slate-500'}`}>
                Esta sección es informativa y no reemplaza la consulta con profesionales de la salud.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/25 hover:scale-[1.02] touch-target"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Hablar con Matías</span>
              </a>
              <p className={`text-[11px] font-bold text-center mt-2 ${isSunlight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                Estoy para escucharte 🤝
              </p>
            </div>

          </div>
        </div>

        {/* NOTA SOBRE EL ENTRENAMIENTO Y LA MENTE */}
        <div className={`mt-8 flex items-start sm:items-center gap-3 p-4 rounded-2xl border text-xs font-semibold ${
          isSunlight
            ? 'bg-slate-50 border-slate-300 text-slate-700'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <Sun className={`w-4 h-4 shrink-0 ${isSunlight ? 'text-amber-500' : 'text-amber-400'}`} />
          <p>
            Recordatorio MOTION LAB: entrenar libera endorfinas y ordena la cabeza, pero no reemplaza
            el descanso ni la ayuda profesional. Entrená fuerte, descansá mejor y pedí ayuda cuando haga falta.
          </p>
        </div>

      </div>
    </section>
  );
}
