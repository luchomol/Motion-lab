'use client';

import Link from 'next/link';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import MotionLabLogo from '@/components/MotionLabLogo';
import { useTheme } from '@/components/ThemeProvider';

import { signOut } from 'next-auth/react';

export default function TrainingHeader({ user = null }) {
  const { isSunlight, toggleSunlight } = useTheme();

  return (
    <header className={`max-w-4xl mx-auto w-full flex items-center justify-between pb-5 border-b mb-6 transition-colors ${
      isSunlight ? 'border-slate-300' : 'border-slate-800/80'
    }`}>
      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className={`inline-flex items-center gap-2 text-xs font-bold transition-colors touch-target ${
            isSunlight ? 'text-slate-700 hover:text-blue-700' : 'text-slate-400 hover:text-sky-400'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </Link>

        {user && (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            isSunlight
              ? 'bg-slate-100 border-slate-300 text-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            👤 {user.name || user.email}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Modo Soleado en Pantalla de Entrenamiento */}
        <button
          onClick={toggleSunlight}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all border ${
            isSunlight
              ? 'bg-slate-200 text-slate-900 border-slate-300'
              : 'bg-slate-900 text-amber-300 border-amber-500/30'
          }`}
          title={isSunlight ? 'Cambiar a modo noche' : 'Activar modo exterior a pleno sol'}
        >
          {isSunlight ? (
            <>
              <Moon className="w-4 h-4 text-slate-800 fill-slate-800" />
              <span>Noche</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>☀️ Sol</span>
            </>
          )}
        </button>

        <Link href="/" className="group">
          <MotionLabLogo className="group-hover:scale-105 transition-transform" />
        </Link>
      </div>
    </header>
  );
}
