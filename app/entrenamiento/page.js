/**
 * ========================================================================
 * PÁGINA: Entrenamiento del Alumno (app/entrenamiento/page.js)
 * ========================================================================
 * Pantalla interactiva donde el alumno:
 * 1. Accede a su Hub con el entrenamiento de hoy y cronograma semanal.
 * 2. Puede alternar al Modo Soleado para ver sus series bajo el sol en pista o campo.
 * 3. Registra series interactivas con auto-minimización y notas técnicas.
 */

import TrainingContainer from '@/components/training/TrainingContainer';
import TrainingHeader from '@/components/training/TrainingHeader';
import MobileBottomBar from '@/components/MobileBottomBar';

export const metadata = {
  title: 'Mi Entrenamiento • Plan Semanal | MOTION LAB',
  description: 'Seguimiento interactivo de series, cronograma semanal y observaciones de entrenamiento.',
};

export default function EntrenamientoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      
      {/* CABECERA CON TOGGLE SOLEADO */}
      <TrainingHeader />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow max-w-4xl mx-auto w-full pb-20 lg:pb-8">
        <TrainingContainer />
      </main>

      {/* PIE */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-8 pb-16 lg:pb-0 text-xs text-slate-500">
        © {new Date().getFullYear()} MOTION LAB • Planificación Semanal y Planilla Digital de Entrenamiento.
      </footer>

      {/* BARRA MÓVIL INFERIOR */}
      <MobileBottomBar />
    </div>
  );
}
