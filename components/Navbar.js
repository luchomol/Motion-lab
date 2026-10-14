'use client';

/**
 * ========================================================================
 * COMPONENTE: Barra de Navegación MOTION LAB (Navbar.js)
 * ========================================================================
 * Barra de menú superior fija con soporte dinámico para Modo Soleado de Alto Contraste.
 * Permite cambiar entre el modo nocturno y el modo exterior con sol directo con un solo clic.
 */

import { useState } from 'react';
import { Menu, X, Dumbbell, ShieldAlert, UserPlus, ArrowRight, LogIn, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import MotionLabLogo from './MotionLabLogo';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { isSunlight, toggleSunlight } = useTheme();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 border-b ${
      isSunlight
        ? 'bg-white/95 backdrop-blur-md border-slate-300 text-slate-900 shadow-md'
        : 'bg-[#05070c]/90 backdrop-blur-md border-slate-800/80 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGOTIPO OFICIAL DE MOTION LAB */}
          <Link href="/" className="flex items-center group">
            <MotionLabLogo className="group-hover:scale-105 transition-transform" />
          </Link>

          {/* ENLACES DE NAVEGACIÓN EN ESCRITORIO */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <Link 
              href="/onboarding" 
              className={`transition-colors flex items-center gap-1.5 font-bold ${
                isSunlight ? 'text-blue-700 hover:text-blue-900' : 'text-sky-400 hover:text-sky-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Onboarding Alumno
            </Link>
            <Link 
              href="/entrenamiento" 
              className={`transition-colors flex items-center gap-1.5 font-semibold ${
                isSunlight ? 'text-slate-800 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
              }`}
            >
              <Dumbbell className={`w-4 h-4 ${isSunlight ? 'text-blue-600' : 'text-cyan-400'}`} />
              Mi Entrenamiento
            </Link>
            <Link 
              href="/admin" 
              className={`transition-colors flex items-center gap-1.5 font-semibold ${
                isSunlight ? 'text-slate-800 hover:text-amber-700' : 'text-slate-200 hover:text-sky-400'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${isSunlight ? 'text-amber-600' : 'text-amber-400'}`} />
              Panel Matías
            </Link>
            <a 
              href="/#sobre-mi" 
              className={`transition-colors font-semibold ${
                isSunlight ? 'text-slate-800 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
              }`}
            >
              Metodología
            </a>
            <a 
              href="/#galeria" 
              className={`transition-colors font-semibold ${
                isSunlight ? 'text-slate-800 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
              }`}
            >
              Ecosistema
            </a>
          </div>

          {/* BOTONES DE ACCIÓN + TOGGLE MODO SOLEADO */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* BOTÓN TOGGLE MODO SOLEADO / ALTO CONTRASTE */}
            <button
              onClick={toggleSunlight}
              type="button"
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-full transition-all border ${
                isSunlight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/30 shadow-inner'
              }`}
              title={isSunlight ? 'Cambiar a modo noche' : 'Cambiar a modo soleado (alto contraste para celular/exterior)'}
            >
              {isSunlight ? (
                <>
                  <Moon className="w-4 h-4 text-slate-800 fill-slate-800" />
                  <span>Modo Noche</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Modo Soleado</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className={`text-sm font-bold transition-colors flex items-center gap-1 px-2.5 py-1.5 ${
                isSunlight ? 'text-slate-800 hover:text-blue-700' : 'text-slate-200 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </Link>

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-full transition-all shadow-md shadow-blue-500/25 hover:scale-105 touch-target"
            >
              <span>Comenzar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* BOTÓN MÓVIL (TOGGLE RÁPIDO Y MENÚ HAMBURGUESA) */}
          <div className="lg:hidden flex items-center gap-2">
            
            <button
              onClick={toggleSunlight}
              type="button"
              className={`p-2.5 rounded-xl border transition-colors touch-target ${
                isSunlight
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900 border-slate-800 text-amber-400'
              }`}
              aria-label={isSunlight ? 'Activar modo oscuro' : 'Activar modo soleado'}
            >
              {isSunlight ? (
                <Moon className="w-5 h-5 text-slate-800 fill-slate-800" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
              )}
            </button>

            <button
              onClick={toggleMenu}
              type="button"
              className={`p-2.5 rounded-xl border transition-colors touch-target ${
                isSunlight
                  ? 'text-slate-900 border-slate-300 hover:bg-slate-100'
                  : 'text-slate-200 border-slate-800 hover:text-white hover:bg-slate-900'
              }`}
              aria-label="Abrir menú"
            >
              {menuAbierto ? (
                <X className={`w-6 h-6 ${isSunlight ? 'text-blue-700' : 'text-sky-400'}`} />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className={`lg:hidden px-4 pt-3 pb-6 space-y-3 shadow-2xl border-b-2 transition-colors ${
          isSunlight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-[#0a0f1d] border-slate-800 text-slate-100'
        }`}>
          <Link
            href="/login"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-bold py-2.5 flex items-center gap-2.5 touch-target ${
              isSunlight ? 'text-blue-700' : 'text-sky-400'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span>Iniciar Sesión</span>
          </Link>
          <Link
            href="/onboarding"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-semibold py-2.5 flex items-center gap-2.5 touch-target ${
              isSunlight ? 'text-slate-900 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
            }`}
          >
            <UserPlus className="w-5 h-5 text-blue-500" />
            <span>Onboarding Alumno</span>
          </Link>
          <Link
            href="/entrenamiento"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-semibold py-2.5 flex items-center gap-2.5 touch-target ${
              isSunlight ? 'text-slate-900 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
            }`}
          >
            <Dumbbell className="w-5 h-5 text-cyan-500" />
            <span>Mi Planilla de Entrenamiento</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-semibold py-2.5 flex items-center gap-2.5 touch-target ${
              isSunlight ? 'text-slate-900 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Panel del Entrenador (Matías)</span>
          </Link>
          <a
            href="/#sobre-mi"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-semibold py-2.5 touch-target ${
              isSunlight ? 'text-slate-900 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
            }`}
          >
            Metodología & Enfoque
          </a>
          <a
            href="/#galeria"
            onClick={() => setMenuAbierto(false)}
            className={`block text-base font-semibold py-2.5 touch-target ${
              isSunlight ? 'text-slate-900 hover:text-blue-700' : 'text-slate-200 hover:text-sky-400'
            }`}
          >
            Ecosistema MOTION LAB
          </a>
          <div className="pt-2">
            <Link
              href="/onboarding"
              onClick={() => setMenuAbierto(false)}
              className="w-full block text-center py-3.5 text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-sky-500 rounded-xl shadow-md touch-target"
            >
              Comenzar Onboarding
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
