'use client';

/**
 * ========================================================================
 * COMPONENTE: Vinculación de Reloj para Mediciones (components/training/WatchLinkCard.js)
 * ========================================================================
 * Permite al alumno vincular su reloj o banda de medición para registrar
 * pulso, pasos y calorías durante las sesiones.
 * - Muestra las marcas y plataformas compatibles.
 * - Guía la vinculación con pasos simples y la guarda en el dispositivo.
 * - Una vez vinculado, permite sincronizar o desvincular el reloj.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Watch, Bluetooth, HeartPulse, Footprints, Flame,
  CheckCircle2, Link2Off, RefreshCw, Loader2, Smartphone
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const CLAVE_RELOJ = 'motion_lab_reloj';

// Marcas y plataformas de medición compatibles
const MARCAS = [
  { id: 'apple', nombre: 'Apple Watch', plataforma: 'Apple Health' },
  { id: 'garmin', nombre: 'Garmin', plataforma: 'Garmin Connect' },
  { id: 'samsung', nombre: 'Samsung Galaxy Watch', plataforma: 'Samsung Health' },
  { id: 'fitbit', nombre: 'Fitbit', plataforma: 'Fitbit App' },
  { id: 'amazfit', nombre: 'Amazfit', plataforma: 'Zepp' },
  { id: 'wearos', nombre: 'Otro smartwatch', plataforma: 'Wear OS / Google Fit' },
];

export default function WatchLinkCard() {
  const { isSunlight } = useTheme();

  const [reloj, setReloj] = useState(null);
  const [mostrarMarcas, setMostrarMarcas] = useState(false);
  const [marcaElegida, setMarcaElegida] = useState(null);
  const [conectando, setConectando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const temporizadorRef = useRef(null);

  // Recuperar el reloj vinculado (persistido en el dispositivo) y limpiar el temporizador
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_RELOJ);
      if (guardado) setReloj(JSON.parse(guardado));
    } catch (e) {
      // Si el almacenamiento está bloqueado se ignora y arranca sin reloj
    }
    return () => {
      if (temporizadorRef.current) clearTimeout(temporizadorRef.current);
    };
  }, []);

  const guardarReloj = (valor) => {
    setReloj(valor);
    try {
      if (valor) window.localStorage.setItem(CLAVE_RELOJ, JSON.stringify(valor));
      else window.localStorage.removeItem(CLAVE_RELOJ);
    } catch (e) {
      // Sin persistencia disponible: el estado igual funciona en memoria
    }
  };

  const conectarMarca = (marca) => {
    setConectando(true);
    temporizadorRef.current = setTimeout(() => {
      const ahora = new Date().toISOString();
      guardarReloj({
        marcaId: marca.id,
        nombre: marca.nombre,
        plataforma: marca.plataforma,
        vinculadoEn: ahora,
        ultimaSync: ahora,
      });
      setConectando(false);
      setMarcaElegida(null);
      setMostrarMarcas(false);
    }, 1600);
  };

  const sincronizarAhora = () => {
    if (!reloj) return;
    setSincronizando(true);
    temporizadorRef.current = setTimeout(() => {
      guardarReloj({ ...reloj, ultimaSync: new Date().toISOString() });
      setSincronizando(false);
    }, 900);
  };

  const desvincular = () => {
    guardarReloj(null);
    setMostrarMarcas(false);
    setMarcaElegida(null);
  };

  const formatearFecha = (iso) => {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border-2 transition-all ${
      isSunlight
        ? 'bg-white border-slate-300 text-slate-900 shadow-md'
        : 'bg-gradient-to-br from-[#0c1424] via-[#0b1220] to-[#05070c] border-slate-800 text-white'
    }`}>

      {/* ENCABEZADO DEL MÓDULO */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            isSunlight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/10 text-sky-400'
          }`}>
            <Watch className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-black text-sm sm:text-base ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
              Reloj & Mediciones
            </h3>
            <p className={`text-xs sm:text-sm font-medium mt-1 leading-relaxed ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
              Vinculá tu reloj o banda para registrar pulso, pasos y calorías en cada sesión.
            </p>
          </div>
        </div>

        {/* ESTADO DE VINCULACIÓN */}
        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
          reloj
            ? isSunlight
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : isSunlight
              ? 'bg-slate-100 text-slate-600 border-slate-300'
              : 'bg-slate-900 text-slate-400 border-slate-800'
        }`}>
          {reloj ? 'Vinculado' : 'Sin vincular'}
        </span>
      </div>

      {/* ==============================================================
          ESTADO VINCULADO: MEDICIONES Y SINCRONIZACIÓN
         ============================================================== */}
      {reloj ? (
        <div className="mt-5 space-y-4">
          <div className={`p-4 rounded-2xl border ${
            isSunlight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/20 border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-2.5 flex-wrap">
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isSunlight ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <span className={`font-black text-sm ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
                {reloj.nombre}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isSunlight ? 'bg-white text-slate-600 border-slate-300' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                {reloj.plataforma}
              </span>
            </div>

            {/* MEDICIONES QUE REGISTRA EL RELOJ */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className={`p-2.5 rounded-xl border ${
                isSunlight ? 'bg-white border-emerald-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <HeartPulse className={`w-4 h-4 mx-auto mb-1 ${isSunlight ? 'text-red-600' : 'text-red-400'}`} />
                <span className={`text-[10px] uppercase font-bold block ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>Pulso</span>
                <span className={`text-xs font-black ${isSunlight ? 'text-slate-900' : 'text-white'}`}>En vivo</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${
                isSunlight ? 'bg-white border-emerald-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <Footprints className={`w-4 h-4 mx-auto mb-1 ${isSunlight ? 'text-blue-600' : 'text-sky-400'}`} />
                <span className={`text-[10px] uppercase font-bold block ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>Pasos</span>
                <span className={`text-xs font-black ${isSunlight ? 'text-slate-900' : 'text-white'}`}>Diarios</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${
                isSunlight ? 'bg-white border-emerald-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <Flame className={`w-4 h-4 mx-auto mb-1 ${isSunlight ? 'text-amber-600' : 'text-amber-400'}`} />
                <span className={`text-[10px] uppercase font-bold block ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>Calorías</span>
                <span className={`text-xs font-black ${isSunlight ? 'text-slate-900' : 'text-white'}`}>Por sesión</span>
              </div>
            </div>

            <p className={`text-[11px] font-bold mt-3 ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>
              Última sincronización: {formatearFecha(reloj.ultimaSync)}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={sincronizarAhora}
              disabled={sincronizando}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black text-xs transition-all shadow-md active:scale-95"
            >
              {sincronizando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>{sincronizando ? 'Sincronizando...' : 'Sincronizar ahora'}</span>
            </button>
            <button
              type="button"
              onClick={desvincular}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-xs transition-all ${
                isSunlight
                  ? 'bg-white hover:bg-red-50 text-red-700 border-red-300'
                  : 'bg-slate-900 hover:bg-red-950/40 text-red-400 border-red-500/30'
              }`}
            >
              <Link2Off className="w-4 h-4" />
              <span>Desvincular</span>
            </button>
          </div>
        </div>
      ) : (
        /* ==============================================================
            ESTADO SIN VINCULAR: FLUJO DE VINCULACIÓN
           ============================================================== */
        <div className="mt-5">
          {!mostrarMarcas && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setMostrarMarcas(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-md active:scale-[0.98] touch-target"
              >
                <Bluetooth className="w-4 h-4" />
                <span>Vincular reloj</span>
              </button>
              <span className={`text-[11px] font-bold ${isSunlight ? 'text-slate-500' : 'text-slate-400'}`}>
                Compatible con Apple Watch, Garmin, Samsung, Fitbit, Amazfit y Wear OS.
              </span>
            </div>
          )}

          {mostrarMarcas && !marcaElegida && (
            <div className="space-y-3">
              <p className={`text-xs sm:text-sm font-bold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
                Elegí tu marca o plataforma de medición:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MARCAS.map((marca) => (
                  <button
                    key={marca.id}
                    type="button"
                    onClick={() => setMarcaElegida(marca)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSunlight
                        ? 'bg-white hover:bg-blue-50 border-slate-300 hover:border-blue-400'
                        : 'bg-slate-900/60 hover:bg-blue-950/30 border-slate-800 hover:border-blue-500/40'
                    }`}
                  >
                    <Watch className={`w-5 h-5 shrink-0 ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`} />
                    <span>
                      <span className={`block font-black text-xs ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
                        {marca.nombre}
                      </span>
                      <span className={`block text-[10px] font-medium ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {marca.plataforma}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMostrarMarcas(false)}
                className={`text-xs font-bold ${isSunlight ? 'text-slate-500 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Cancelar
              </button>
            </div>
          )}

          {mostrarMarcas && marcaElegida && (
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isSunlight ? 'bg-blue-50/70 border-blue-300' : 'bg-blue-950/20 border-blue-500/30'
            }`}>
              <div className="flex items-center gap-2.5">
                <Smartphone className={`w-4 h-4 shrink-0 ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`} />
                <span className={`font-black text-sm ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
                  Vinculando {marcaElegida.nombre}
                </span>
              </div>

              <ol className={`space-y-1.5 text-xs font-medium list-decimal list-inside ${
                isSunlight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <li>Activá el Bluetooth del celular y acercalo al reloj.</li>
                <li>Aceptá la solicitud de sincronización en {marcaElegida.plataforma}.</li>
                <li>Cuando diga "Conectado", ya podés entrenar con mediciones.</li>
              </ol>

              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => conectarMarca(marcaElegida)}
                  disabled={conectando}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black text-xs transition-all shadow-md active:scale-95"
                >
                  {conectando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
                  <span>{conectando ? 'Buscando dispositivos cercanos...' : 'Conectar ahora'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMarcaElegida(null)}
                  disabled={conectando}
                  className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all disabled:opacity-60 ${
                    isSunlight
                      ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
