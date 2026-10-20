'use client';

/**
 * ========================================================================
 * COMPONENTE: Tarjeta QR para compartir el acceso (components/admin/QrShareCard.js)
 * ========================================================================
 * Muestra un código QR con la dirección actual de la web para que el coach
 * Matías pueda mostrárselo a sus clientes y ellos abran la app desde el celular.
 * Incluye botones para copiar el enlace y descargar el QR como imagen PNG.
 */

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Copy, Download, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function QrShareCard() {
  const { isSunlight } = useTheme();
  const [url, setUrl] = useState('');
  const [copiado, setCopiado] = useState(false);
  const contenedorQr = useRef(null);

  // La URL se resuelve en el navegador para que el QR apunte siempre
  // al dominio actual (producción en Vercel o localhost en desarrollo).
  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      // Navegador sin permisos de portapapeles: se puede copiar la URL a mano
    }
  };

  const descargarQr = () => {
    const canvas = contenedorQr.current?.querySelector('canvas');
    if (!canvas) return;
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL('image/png');
    enlace.download = 'motion-lab-qr.png';
    enlace.click();
  };

  return (
    <section className={`rounded-3xl border p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6 transition-colors ${
      isSunlight ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#0b1220] border-slate-800'
    }`}>

      {/* INFORMACIÓN Y ACCIONES */}
      <div className="flex-1 space-y-3 text-center md:text-left">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
          isSunlight ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-500/10 text-sky-400 border-blue-500/20'
        }`}>
          <QrCode className="w-3.5 h-3.5" />
          Compartir Acceso
        </div>

        <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isSunlight ? 'text-slate-900' : 'text-white'}`}>
          QR para tus clientes
        </h2>

        <p className={`text-xs sm:text-sm font-medium ${isSunlight ? 'text-slate-600' : 'text-slate-400'}`}>
          Mostrales este código y lo escanean con la cámara del celular para entrar a la web al instante.
          También podés descargarlo o copiar el enlace para enviarlo por WhatsApp.
        </p>

        <div className={`inline-block max-w-full px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-bold truncate ${
          isSunlight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          {url || 'Cargando dirección...'}
        </div>

        <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap pt-1">
          <button
            type="button"
            onClick={copiarEnlace}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-sky-500/20"
          >
            {copiado ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiado ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
          </button>
          <button
            type="button"
            onClick={descargarQr}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-xs transition-all ${
              isSunlight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Descargar QR (PNG)</span>
          </button>
        </div>
      </div>

      {/* CÓDIGO QR EN MARCO BLANCO (SIEMPRE CON ALTO CONTRASTE) */}
      <div className="shrink-0">
        <div ref={contenedorQr} className="bg-white p-4 rounded-2xl border-4 border-sky-500/40 shadow-xl">
          {url ? (
            <QRCodeCanvas value={url} size={148} bgColor="#ffffff" fgColor="#0b1220" level="M" />
          ) : (
            <div className="w-[148px] h-[148px] animate-pulse bg-slate-200 rounded" />
          )}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-center mt-2 text-slate-500">
          Escaneá con la cámara
        </p>
      </div>

    </section>
  );
}
