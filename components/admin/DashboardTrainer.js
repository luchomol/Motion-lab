'use client';

/**
 * ========================================================================
 * COMPONENTE: Panel del Entrenador Matías (components/admin/DashboardTrainer.js)
 * ========================================================================
 * Permite a Matías:
 * 1. Monitorear los alumnos que completaron el Onboarding.
 * 2. Validar pagos cambiando el estado de 'PENDIENTE' a 'ACTIVO' con un clic.
 * 3. Inspeccionar el perfil deportivo, lesiones y RM de cada alumno.
 * 4. Asignar o diseñar rutinas divididas estrictamente en los 3 bloques:
 *    - Bloque de Movilidad
 *    - Bloque de Activación
 *    - Bloque de Desarrollo
 */

import { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Clock, Dumbbell, ShieldCheck, 
  Search, Eye, Plus, Trash2, ArrowRight, X, Sparkles, Activity 
} from 'lucide-react';

export default function DashboardTrainer() {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('TODOS'); // 'TODOS', 'PENDIENTES', 'ACTIVOS'
  const [busqueda, setBusqueda] = useState('');
  
  // Alumno seleccionado para ver perfil o asignarle rutina
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardandoRutina, setGuardandoRutina] = useState(false);
  const [notificacion, setNotificacion] = useState('');

  // Estructura de la rutina a crear (3 bloques estrictos)
  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: 'Sesión A - Fuerza & Potencia',
    descripcion: 'Enfocada en miembros inferiores y patrones dominantes de rodilla.',
    bloques: [
      {
        tipo: 'MOVILIDAD',
        orden: 1,
        ejercicios: [
          { nombre: 'Movilidad de Tobillo contra Pared', indicacionProfe: '2x10 por pierna. Controlar talón.' },
          { nombre: 'Rotaciones 90/90 de Cadera', indicacionProfe: '2x8 cambios dinámicos.' },
        ],
      },
      {
        tipo: 'ACTIVACION',
        orden: 2,
        ejercicios: [
          { nombre: 'Puente de Glúteo Unilateral con Banda', indicacionProfe: '3x12 por pierna con pausa arriba.' },
          { nombre: 'Snap Down to Box Jump', indicacionProfe: '3x4 saltos al cajón. Absorber impacto.' },
        ],
      },
      {
        tipo: 'DESARROLLO',
        orden: 3,
        ejercicios: [
          {
            nombre: 'Sentadilla Trasera con Barra (Back Squat)',
            indicacionProfe: '3x8 | RIR Objetivo: 2 | Descanso 2:30 min',
            rirObjetivo: 2,
            series: [
              { numeroSerie: 1, repsRealizadas: 8, cargaKg: 80, rir: 2, rpe: 8 },
              { numeroSerie: 2, repsRealizadas: 8, cargaKg: 80, rir: 2, rpe: 8 },
              { numeroSerie: 3, repsRealizadas: 8, cargaKg: 80, rir: 2, rpe: 8 },
            ],
          },
          {
            nombre: 'Empuje de Cadera con Barra (Barbell Hip Thrust)',
            indicacionProfe: '3x10 | RIR Objetivo: 2 | Pausa 1 seg',
            rirObjetivo: 2,
            series: [
              { numeroSerie: 1, repsRealizadas: 10, cargaKg: 100, rir: 2, rpe: 8 },
              { numeroSerie: 2, repsRealizadas: 10, cargaKg: 100, rir: 2, rpe: 8 },
              { numeroSerie: 3, repsRealizadas: 10, cargaKg: 100, rir: 2, rpe: 8 },
            ],
          },
        ],
      },
    ],
  });

  // Cargar lista de alumnos desde el backend
  const cargarAlumnos = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/entrenador/alumnos');
      const data = await res.json();
      if (data.success) {
        setAlumnos(data.alumnos);
      }
    } catch (err) {
      console.error('Error cargando alumnos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  // Cambiar estado de pago (PENDIENTE <-> ACTIVO)
  const toggleEstadoPago = async (alumnoId, estadoActual) => {
    const nuevoEstado = estadoActual === 'PENDIENTE' ? 'ACTIVO' : 'PENDIENTE';
    try {
      const res = await fetch(`/api/entrenador/alumnos/${alumnoId}/estado-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoPago: nuevoEstado }),
      });
      const data = await res.json();

      if (data.success) {
        setAlumnos((prev) =>
          prev.map((a) => (a.id === alumnoId ? { ...a, estadoPago: nuevoEstado } : a))
        );
        mostrarAviso(`Pago de alumno actualizado a: ${nuevoEstado}`);
      }
    } catch (err) {
      console.error('Error cambiando estado de pago:', err);
    }
  };

  // Asignar rutina al alumno en el modal
  const guardarYAsignarRutina = async () => {
    if (!alumnoSeleccionado) return;
    setGuardandoRutina(true);

    try {
      const res = await fetch('/api/rutinas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumnoId: alumnoSeleccionado.id,
          nombre: nuevaRutina.nombre,
          descripcion: nuevaRutina.descripcion,
          bloques: nuevaRutina.bloques,
        }),
      });

      const data = await res.json();
      if (data.success) {
        mostrarAviso(`¡Rutina "${nuevaRutina.nombre}" asignada con éxito!`);
        setModalAbierto(false);
        cargarAlumnos();
      }
    } catch (err) {
      console.error('Error al asignar rutina:', err);
    } finally {
      setGuardandoRutina(false);
    }
  };

  const mostrarAviso = (msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(''), 4000);
  };

  // Filtrado de alumnos
  const alumnosFiltrados = alumnos.filter((a) => {
    const coincideFiltro =
      filtro === 'TODOS'
        ? true
        : filtro === 'PENDIENTES'
        ? a.estadoPago === 'PENDIENTE'
        : a.estadoPago === 'ACTIVO';

    const textoBusqueda = `${a.nombre} ${a.apellido || ''} ${a.email} ${a.perfilDeportivo?.deporte || ''}`.toLowerCase();
    const coincideBusqueda = textoBusqueda.includes(busqueda.toLowerCase());

    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      
      {/* NOTIFICACIÓN TOAST */}
      {notificacion && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-sky-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notificacion}</span>
        </div>
      )}

      {/* ENCABEZADO DEL DASHBOARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/20">
            <Activity className="w-3.5 h-3.5" />
            Panel del Entrenador
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gestión de Alumnos • <span className="text-sky-400">Coach Matías</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Valida los pagos de los alumnos y asígnales su planificación estructurada en 3 bloques.
          </p>
        </div>

        {/* CONTADOR RÁPIDO */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block font-medium">Total Alumnos</span>
            <span className="text-xl font-black text-white">{alumnos.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-xs text-amber-400 block font-bold">Pendientes</span>
            <span className="text-xl font-black text-amber-400">
              {alumnos.filter((a) => a.estadoPago === 'PENDIENTE').length}
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
            <span className="text-xs text-sky-400 block font-bold">Activos</span>
            <span className="text-xl font-black text-sky-400">
              {alumnos.filter((a) => a.estadoPago === 'ACTIVO').length}
            </span>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* BOTONES DE FILTRO */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'PENDIENTES', label: 'Pendientes de Pago' },
            { id: 'ACTIVOS', label: 'Alumnos Activos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltro(tab.id)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                filtro === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* INPUT DE BÚSQUEDA */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, deporte..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

      </div>

      {/* TABLA DE ALUMNOS */}
      <div className="bg-[#0b1220] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl card-glow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Alumno</th>
                <th className="py-4 px-6">Plan & Deporte</th>
                <th className="py-4 px-6">Nivel & Focos</th>
                <th className="py-4 px-6">Estado de Pago</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cargando ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Cargando base de datos de alumnos...
                  </td>
                </tr>
              ) : alumnosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No se encontraron alumnos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                alumnosFiltrados.map((alumno) => {
                  const esActivo = alumno.estadoPago === 'ACTIVO';
                  const perfil = alumno.perfilDeportivo;

                  return (
                    <tr key={alumno.id} className="hover:bg-slate-900/40 transition-colors">
                      
                      {/* COLUMNA 1: ALUMNO */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-slate-950 font-black text-sm shrink-0">
                            {alumno.nombre?.[0] || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {alumno.nombre} {alumno.apellido || ''}
                            </div>
                            <div className="text-[11px] text-slate-400">{alumno.email}</div>
                            {alumno.whatsapp && (
                              <div className="text-[10px] text-sky-400 mt-0.5">{alumno.whatsapp}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* COLUMNA 2: PLAN Y DEPORTE */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            alumno.tipoPlan === 'PREMIUM'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-sky-400 border border-blue-500/30'
                          }`}>
                            {alumno.tipoPlan === 'PREMIUM' ? 'Plan Premium 1 a 1' : 'Plan Base'}
                          </span>
                          <div className="text-white font-medium">
                            {perfil?.deporte || 'Fitness General'}
                            {perfil?.club && (
                              <span className="text-[10px] text-slate-400 block font-normal">(Club Federado)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* COLUMNA 3: NIVEL Y FOCOS */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="text-slate-200 font-semibold block">
                            {perfil?.nivel || 'Principiante'}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            🎯 {perfil?.focos || 'General'}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            📅 {perfil?.disponibilidad || '3 días'}
                          </span>
                        </div>
                      </td>

                      {/* COLUMNA 4: ESTADO DE PAGO & TOGGLE */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleEstadoPago(alumno.id, alumno.estadoPago)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                              esActivo
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/40'
                            }`}
                            title="Haz clic para alternar estado"
                          >
                            {esActivo ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Activo (Pagado)</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pendiente de Pago</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* COLUMNA 5: ACCIONES */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setAlumnoSeleccionado(alumno);
                            setModalAbierto(true);
                          }}
                          className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha / Rutina</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================
          MODAL: FICHA DEL ALUMNO Y ASIGNADOR DE RUTINA EN 3 BLOQUES
         ================================================================ */}
      {modalAbierto && alumnoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b1220] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* CABECERA MODAL */}
            <div className="mb-6 pb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Ficha Técnica del Alumno
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido || ''}
              </h2>
              <p className="text-xs text-slate-400">
                Email: {alumnoSeleccionado.email} • WhatsApp: {alumnoSeleccionado.whatsapp || 'No indicado'}
              </p>
            </div>

            {/* SECCIÓN 1: DATOS BIOMÉTRICOS Y OBJETIVOS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Peso Corporal</span>
                <div className="text-base font-black text-white">
                  {alumnoSeleccionado.peso ? `${alumnoSeleccionado.peso} kg` : 'N/D'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Altura</span>
                <div className="text-base font-black text-white">
                  {alumnoSeleccionado.altura ? `${alumnoSeleccionado.altura} cm` : 'N/D'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Objetivo</span>
                <div className="text-base font-black text-sky-400">
                  {alumnoSeleccionado.perfilDeportivo?.objetivo || 'Rendimiento'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Nivel</span>
                <div className="text-base font-black text-white">
                  {alumnoSeleccionado.perfilDeportivo?.nivel || 'Principiante'}
                </div>
              </div>
            </div>

            {/* LESIONES O RM SI EXISTEN */}
            {(alumnoSeleccionado.lesiones || alumnoSeleccionado.perfilDeportivo?.rmEstimado) && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs mb-6 space-y-1.5">
                {alumnoSeleccionado.lesiones && (
                  <div>
                    <strong className="text-amber-400">⚠️ Lesiones reportadas:</strong>{' '}
                    <span className="text-slate-300">{alumnoSeleccionado.lesiones}</span>
                  </div>
                )}
                {alumnoSeleccionado.perfilDeportivo?.rmEstimado && (
                  <div>
                    <strong className="text-amber-400">⚡ RMs informadas:</strong>{' '}
                    <span className="text-slate-300">{alumnoSeleccionado.perfilDeportivo.rmEstimado}</span>
                  </div>
                )}
                {alumnoSeleccionado.perfilDeportivo?.puntosDebiles && (
                  <div>
                    <strong className="text-amber-400">🎯 Puntos débiles a enfocar:</strong>{' '}
                    <span className="text-slate-300">{alumnoSeleccionado.perfilDeportivo.puntosDebiles}</span>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN 2: ASIGNACIÓN DE RUTINA EN 3 BLOQUES */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Estructura de Rutina para Asignar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dividida estrictamente en: Movilidad, Activación y Desarrollo.
                  </p>
                </div>
              </div>

              {/* NOMBRE DE LA RUTINA */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre de la Sesión</label>
                <input
                  type="text"
                  value={nuevaRutina.nombre}
                  onChange={(e) => setNuevaRutina({ ...nuevaRutina, nombre: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* LISTA DE LOS 3 BLOQUES PREVIOS */}
              <div className="space-y-3">
                
                {/* BLOQUE 1: MOVILIDAD */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider">
                      Bloque 1: MOVILIDAD
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Control Articular (Checkbox)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {nuevaRutina.bloques[0].ejercicios.map((ej, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <div>
                          <strong>{ej.nombre}</strong>: <span className="text-slate-400">{ej.indicacionProfe}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BLOQUE 2: ACTIVACIÓN */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                      Bloque 2: ACTIVACIÓN
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Series & Reps del Profe</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {nuevaRutina.bloques[1].ejercicios.map((ej, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <div>
                          <strong>{ej.nombre}</strong>: <span className="text-slate-400">{ej.indicacionProfe}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BLOQUE 3: DESARROLLO */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                      Bloque 3: DESARROLLO (Crucial)
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Tabla interactiva + Observaciones</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {nuevaRutina.bloques[2].ejercicios.map((ej, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <div>
                          <strong>{ej.nombre}</strong>: <span className="text-slate-400">{ej.indicacionProfe}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* BOTÓN ASIGNAR */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="py-2.5 px-5 rounded-full text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={guardandoRutina}
                  onClick={guardarYAsignarRutina}
                  className="py-3 px-6 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {guardandoRutina ? (
                    <span>Guardando en base de datos...</span>
                  ) : (
                    <>
                      <span>Asignar Rutina a {alumnoSeleccionado.nombre}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
