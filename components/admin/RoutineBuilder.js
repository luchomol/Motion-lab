'use client';

import { useState } from 'react';
import { Plus, Trash2, Video, X, ArrowRight, Save, PlayCircle } from 'lucide-react';

export default function RoutineBuilder({ alumno, onCancel, onSave }) {
  const [nombre, setNombre] = useState('Nueva Sesión');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Inicializar los 3 bloques obligatorios
  const [bloques, setBloques] = useState([
    { tipo: 'MOVILIDAD', orden: 1, ejercicios: [] },
    { tipo: 'ACTIVACION', orden: 2, ejercicios: [] },
    { tipo: 'DESARROLLO', orden: 3, ejercicios: [] },
  ]);

  const getBloqueTitulo = (tipo) => {
    switch (tipo) {
      case 'MOVILIDAD': return { titulo: 'Bloque 1: MOVILIDAD', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
      case 'ACTIVACION': return { titulo: 'Bloque 2: ACTIVACIÓN', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
      case 'DESARROLLO': return { titulo: 'Bloque 3: DESARROLLO', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
      default: return { titulo: tipo, color: 'text-white' };
    }
  };

  const agregarEjercicio = (bloqueIndex) => {
    const nuevosBloques = [...bloques];
    nuevosBloques[bloqueIndex].ejercicios.push({
      nombre: '',
      seriesCount: 3,
      repsCount: 10,
      indicacionProfe: '',
      videoUrl: '',
      videoRecomendacion: '',
      mostrarVideoInput: false,
    });
    setBloques(nuevosBloques);
  };

  const eliminarEjercicio = (bloqueIndex, ejIndex) => {
    const nuevosBloques = [...bloques];
    nuevosBloques[bloqueIndex].ejercicios.splice(ejIndex, 1);
    setBloques(nuevosBloques);
  };

  const updateEjercicio = (bloqueIndex, ejIndex, campo, valor) => {
    const nuevosBloques = [...bloques];
    nuevosBloques[bloqueIndex].ejercicios[ejIndex][campo] = valor;
    setBloques(nuevosBloques);
  };

  const handleSave = async () => {
    setGuardando(true);
    // Formatear los datos para la API
    const bloquesFormateados = bloques.map((bloque) => ({
      tipo: bloque.tipo,
      orden: bloque.orden,
      ejercicios: bloque.ejercicios.map((ej) => {
        const seriesArr = [];
        if (bloque.tipo === 'DESARROLLO') {
          // Generar las series para la base de datos
          for (let i = 1; i <= (ej.seriesCount || 1); i++) {
            seriesArr.push({ numeroSerie: i, repsRealizadas: Number(ej.repsCount) || 0 });
          }
        }
        
        let indicacion = ej.indicacionProfe;
        if (!indicacion && ej.seriesCount && ej.repsCount) {
          indicacion = `${ej.seriesCount} series de ${ej.repsCount} repeticiones.`;
        }

        return {
          nombre: ej.nombre || 'Ejercicio sin nombre',
          indicacionProfe: indicacion,
          videoUrl: ej.videoUrl,
          videoRecomendacion: ej.videoRecomendacion,
          series: seriesArr,
        };
      })
    }));

    await onSave({
      nombre,
      descripcion,
      bloques: bloquesFormateados,
    });
    setGuardando(false);
  };

  return (
    <div className="space-y-6">
      {/* DATOS GENERALES DE LA RUTINA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de la Sesión</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400"
            placeholder="Ej: Sesión A - Empujes"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Descripción Breve (Opcional)</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400"
            placeholder="Enfoque en pecho y hombros"
          />
        </div>
      </div>

      {/* BLOQUES PASO A PASO */}
      <div className="space-y-8">
        {bloques.map((bloque, bIdx) => {
          const estilo = getBloqueTitulo(bloque.tipo);
          
          return (
            <div key={bloque.tipo} className={`rounded-2xl p-5 border ${estilo.border} bg-slate-900/50`}>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className={`text-sm font-black uppercase tracking-wider ${estilo.color}`}>
                  {estilo.titulo}
                </h3>
                <button
                  type="button"
                  onClick={() => agregarEjercicio(bIdx)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Añadir Ejercicio
                </button>
              </div>

              <div className="space-y-4">
                {bloque.ejercicios.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No hay ejercicios en este bloque. Añade uno para comenzar.</p>
                ) : (
                  bloque.ejercicios.map((ej, eIdx) => (
                    <div key={eIdx} className="bg-[#0b1220] border border-slate-700 rounded-xl p-4 relative group">
                      <button
                        onClick={() => eliminarEjercicio(bIdx, eIdx)}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                        title="Eliminar Ejercicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-8">
                        {/* Nombre del Ejercicio */}
                        <div className="col-span-12 sm:col-span-6">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Ejercicio</label>
                          <input
                            type="text"
                            value={ej.nombre}
                            onChange={(e) => updateEjercicio(bIdx, eIdx, 'nombre', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                            placeholder="Ej: Sentadilla"
                          />
                        </div>

                        {/* Series */}
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Series</label>
                          <input
                            type="number"
                            min="1"
                            value={ej.seriesCount}
                            onChange={(e) => updateEjercicio(bIdx, eIdx, 'seriesCount', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                          />
                        </div>

                        {/* Repeticiones */}
                        <div className="col-span-6 sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Reps</label>
                          <input
                            type="number"
                            min="1"
                            value={ej.repsCount}
                            onChange={(e) => updateEjercicio(bIdx, eIdx, 'repsCount', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                          />
                        </div>
                        
                        {/* Botón Pequeño de Video */}
                        <div className="col-span-12 sm:col-span-2 flex items-end">
                          <button
                            type="button"
                            onClick={() => updateEjercicio(bIdx, eIdx, 'mostrarVideoInput', !ej.mostrarVideoInput)}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold transition-colors ${
                              ej.videoUrl 
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <Video className="w-3.5 h-3.5" />
                            {ej.videoUrl ? 'Video Añadido' : 'Añadir Video'}
                          </button>
                        </div>
                      </div>

                      {/* Indicaciones Opcionales (para que el profe anote tempos o descansos) */}
                      <div className="mt-3">
                        <input
                          type="text"
                          value={ej.indicacionProfe}
                          onChange={(e) => updateEjercicio(bIdx, eIdx, 'indicacionProfe', e.target.value)}
                          className="w-full bg-transparent border-b border-slate-800 pb-1 text-xs text-slate-400 focus:outline-none focus:border-sky-400 placeholder-slate-600 transition-colors"
                          placeholder="Indicaciones adicionales (Ej: Descanso 2 min, Tempo 3-0-1-0)"
                        />
                      </div>

                      {/* Inputs de Video Desplegables */}
                      {ej.mostrarVideoInput && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 space-y-3 animate-fadeIn">
                          <div className="flex gap-2 items-center">
                            <PlayCircle className="w-4 h-4 text-sky-400 shrink-0" />
                            <input
                              type="url"
                              value={ej.videoUrl}
                              onChange={(e) => updateEjercicio(bIdx, eIdx, 'videoUrl', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-sky-400 focus:outline-none"
                              placeholder="Enlace de YouTube o video (Ej: https://youtube.com/watch?v=...)"
                            />
                          </div>
                          <textarea
                            value={ej.videoRecomendacion}
                            onChange={(e) => updateEjercicio(bIdx, eIdx, 'videoRecomendacion', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none min-h-[60px]"
                            placeholder="Recomendaciones clave a tener en cuenta al ver el video o ejecutar el ejercicio..."
                          />
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTONES FINALES */}
      <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="py-2.5 px-5 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={guardando}
          onClick={handleSave}
          className="py-3 px-6 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {guardando ? (
            <span>Guardando Rutina...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar y Asignar a {alumno.nombre}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
