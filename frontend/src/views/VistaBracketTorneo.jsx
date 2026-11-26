// src/views/VistaBracketTorneo.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import LogoSportMingle from '../components/LogoSportMingle';
import UserMenuDropdown from '../components/UserMenuDropdown';
import { decodeToken } from '../utils/decodeJWT';
import { formatearFecha, formatearFechaHora } from '../utils/format';
import api from '../utils/api';

const VistaBracketTorneo = () => {
  const { idTorneo } = useParams();
  const navigate = useNavigate();

  const [torneo, setTorneo] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estado para modal/editor de resultado
  const [partidoEditando, setPartidoEditando] = useState(null);
  const [resultadoLocal, setResultadoLocal] = useState('');
  const [resultadoVisitante, setResultadoVisitante] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Estado para crear nuevo partido (organizador)
  const [mostrarCrearPartido, setMostrarCrearPartido] = useState(false);
  const [nuevoLocal, setNuevoLocal] = useState('');
  const [nuevoVisitante, setNuevoVisitante] = useState('');
  const [nuevaFase, setNuevaFase] = useState('Cuartos de final');
  const [nuevaFechaHora, setNuevaFechaHora] = useState('');

  const token = localStorage.getItem('token');
  const usuario = token ? decodeToken(token) : null;
  const idUsuarioActual = usuario?.id;

  const cargarDatos = async () => {
    try {
      // 1. Obtener detalles del torneo
      const resTorneo = await api.get(`/api/torneos/${idTorneo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTorneo(resTorneo.data);

      // 2. Obtener partidos del torneo
      const resPartidos = await api.get(`/api/partidos-torneo/torneo/${idTorneo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartidos(Array.isArray(resPartidos.data) ? resPartidos.data : []);

      // 3. Obtener clubes inscritos
      const resInscripciones = await api.get(`/api/inscripciones/torneo/${idTorneo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInscripciones(Array.isArray(resInscripciones.data) ? resInscripciones.data : []);
    } catch (err) {
      console.error('Error al cargar datos del bracket:', err);
      setError('No se pudo cargar la información del bracket.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [idTorneo]);

  const esOrganizador =
    torneo &&
    (torneo.idOrganizador === idUsuarioActual ||
      torneo.organizador?.idUsuario === idUsuarioActual);

  // Manejar edición de resultados
  const abrirEditorResultado = (partido) => {
    setPartidoEditando(partido);
    setResultadoLocal(partido.resultadoLocal !== null ? partido.resultadoLocal : '');
    setResultadoVisitante(partido.resultadoVisitante !== null ? partido.resultadoVisitante : '');
  };

  const guardarResultado = async (e) => {
    e.preventDefault();
    if (!partidoEditando) return;

    setGuardando(true);
    try {
      await api.put(
        `/api/partidos-torneo/${partidoEditando.idPartido}/resultados`,
        {
          resultadoLocal: parseInt(resultadoLocal, 10),
          resultadoVisitante: parseInt(resultadoVisitante, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Recargar partidos
      await cargarDatos();
      setPartidoEditando(null);
    } catch (err) {
      console.error('Error al actualizar resultados:', err);
      alert('No se pudo guardar el resultado.');
    } finally {
      setGuardando(false);
    }
  };

  // Crear nuevo partido de bracket (organizador)
  const handleCrearPartido = async (e) => {
    e.preventDefault();
    if (!nuevoLocal || !nuevoVisitante) {
      alert('Debes seleccionar ambos equipos.');
      return;
    }
    if (nuevoLocal === nuevoVisitante) {
      alert('Un equipo no puede jugar contra sí mismo.');
      return;
    }

    setGuardando(true);
    try {
      await api.post(
        '/api/partidos-torneo',
        {
          torneo: { id: parseInt(idTorneo, 10) },
          equipoLocal: { id: parseInt(nuevoLocal, 10) },
          equipoVisitante: { id: parseInt(nuevoVisitante, 10) },
          fechaHora: nuevaFechaHora || new Date().toISOString(),
          faseTorneo: nuevaFase,
          estado: 'PROGRAMADO',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await cargarDatos();
      setMostrarCrearPartido(false);
      setNuevoLocal('');
      setNuevoVisitante('');
    } catch (err) {
      console.error('Error al crear partido de bracket:', err);
      alert('No se pudo crear el partido.');
    } finally {
      setGuardando(false);
    }
  };

  // Agrupar partidos por fase
  const fasesOrden = ['Octavos de final', 'Cuartos de final', 'Semifinal', 'Semifinales', 'Final'];

  const partidosPorFase = partidos.reduce((acc, p) => {
    const fase = p.faseTorneo || 'Fase Regular';
    if (!acc[fase]) acc[fase] = [];
    acc[fase].push(p);
    return acc;
  }, {});

  const fasesExistentes = Object.keys(partidosPorFase).sort((a, b) => {
    const idxA = fasesOrden.indexOf(a);
    const idxB = fasesOrden.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando bracket del torneo...</p>
      </div>
    );
  }

  if (error || !torneo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'No se encontró el torneo.'}</p>
          <div className="flex justify-center">
            <BackArrow />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BackArrow />
            <div className="hidden sm:block">
              <LogoSportMingle />
            </div>
          </div>

          <div className="sm:hidden">
            <LogoSportMingle />
          </div>

          <div className="flex items-center">
            <UserMenuDropdown />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Banner Hero del Torneo */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                  {torneo.deporte || 'Deporte'}
                </span>
                <span className="bg-amber-400 text-gray-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {torneo.estado || 'En Progreso'}
                </span>
                {esOrganizador && (
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    Organizador 👑
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                🏆 {torneo.nombre}
              </h1>

              <p className="text-amber-100 text-sm">
                Fecha de inicio: {formatearFecha(torneo.fechaInicio)}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="text-xs uppercase font-semibold text-amber-200">
                Clubes Participantes
              </span>
              <span className="text-3xl font-black text-white">
                {inscripciones.length}
              </span>
            </div>
          </div>
        </div>

        {/* Panel de administración para el organizador */}
        {esOrganizador && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
                ⚙️
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Panel del Organizador</h3>
                <p className="text-xs text-gray-500">
                  Puedes agregar nuevos partidos a las fases y actualizar los resultados conforme avancen los equipos.
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarCrearPartido(!mostrarCrearPartido)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition shrink-0"
            >
              <span>{mostrarCrearPartido ? 'Cerrar formulario' : '+ Agregar Partido al Bracket'}</span>
            </button>
          </div>
        )}

        {/* Formulario para agregar partido */}
        {mostrarCrearPartido && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚔️</span>
              <span>Programar Nuevo Partido en el Bracket</span>
            </h3>

            <form onSubmit={handleCrearPartido} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Equipo Local (Club)
                </label>
                <select
                  required
                  value={nuevoLocal}
                  onChange={(e) => setNuevoLocal(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecciona equipo local...</option>
                  {inscripciones.map((ins) => (
                    <option key={ins.idClub || ins.id} value={ins.idClub || ins.id}>
                      {ins.nombreClub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Equipo Visitante (Club)
                </label>
                <select
                  required
                  value={nuevoVisitante}
                  onChange={(e) => setNuevoVisitante(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Selecciona equipo visitante...</option>
                  {inscripciones.map((ins) => (
                    <option key={ins.idClub || ins.id} value={ins.idClub || ins.id}>
                      {ins.nombreClub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fase del Torneo</label>
                <select
                  value={nuevaFase}
                  onChange={(e) => setNuevaFase(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Octavos de final">Octavos de final</option>
                  <option value="Cuartos de final">Cuartos de final</option>
                  <option value="Semifinal">Semifinal</option>
                  <option value="Final">Final</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  value={nuevaFechaHora}
                  onChange={(e) => setNuevaFechaHora(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarCrearPartido(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : 'Guardar Partido'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sección Bracket / Partidos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>📊</span>
              <span>Cuadro de Enfrentamientos (Bracket)</span>
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {partidos.length} {partidos.length === 1 ? 'partido' : 'partidos'}
            </span>
          </div>

          {partidos.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs">
              <span className="text-5xl block mb-3">🏆</span>
              <h3 className="text-base font-bold text-gray-800">
                Los emparejamientos del cuadro aún no han sido publicados
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                El torneo ha comenzado. El organizador está definiendo los partidos y horarios de los clubes inscritos.
              </p>
            </div>
          ) : (
            /* Cuadro por fases (Responsive horizontal scroll en móvil) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {fasesExistentes.map((fase) => (
                <div
                  key={fase}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="font-black text-gray-900 text-sm uppercase tracking-wide">
                      {fase}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {partidosPorFase[fase].length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {partidosPorFase[fase].map((p) => {
                      const localEsGanador =
                        p.resultadoLocal !== null &&
                        p.resultadoVisitante !== null &&
                        p.resultadoLocal > p.resultadoVisitante;

                      const visitanteEsGanador =
                        p.resultadoLocal !== null &&
                        p.resultadoVisitante !== null &&
                        p.resultadoVisitante > p.resultadoLocal;

                      return (
                        <div
                          key={p.idPartido}
                          className="p-3.5 bg-slate-50/70 border border-gray-100 rounded-2xl hover:border-amber-200 hover:shadow-xs transition space-y-2.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>
                              {p.fechaHora ? formatearFechaHora(p.fechaHora) : 'Por definir'}
                            </span>
                            <span
                              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                p.estado === 'FINALIZADO'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.estado === 'EN_JUEGO'
                                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {p.estado}
                            </span>
                          </div>

                          {/* Equipos y Marcador */}
                          <div className="space-y-1.5 pt-1">
                            {/* Equipo Local */}
                            <div
                              className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                                localEsGanador
                                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80'
                                  : 'bg-white text-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate pr-2">
                                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  L
                                </span>
                                <span className="truncate">
                                  {p.equipoLocal?.nombre || 'Equipo Local'}
                                </span>
                              </div>
                              <span className="text-sm font-black px-2 py-0.5 rounded bg-gray-100 shrink-0">
                                {p.resultadoLocal !== null ? p.resultadoLocal : '-'}
                              </span>
                            </div>

                            {/* Equipo Visitante */}
                            <div
                              className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                                visitanteEsGanador
                                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80'
                                  : 'bg-white text-gray-800'
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate pr-2">
                                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  V
                                </span>
                                <span className="truncate">
                                  {p.equipoVisitante?.nombre || 'Equipo Visitante'}
                                </span>
                              </div>
                              <span className="text-sm font-black px-2 py-0.5 rounded bg-gray-100 shrink-0">
                                {p.resultadoVisitante !== null ? p.resultadoVisitante : '-'}
                              </span>
                            </div>
                          </div>

                          {/* Botón para editar resultado (si es organizador) */}
                          {esOrganizador && (
                            <div className="pt-1 flex justify-end">
                              <button
                                onClick={() => abrirEditorResultado(p)}
                                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                              >
                                <span>✏️ Actualizar Marcador</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para editar marcador */}
      {partidoEditando && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Actualizar Marcador</h3>
              <button
                onClick={() => setPartidoEditando(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={guardarResultado} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {partidoEditando.equipoLocal?.nombre || 'Local'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={resultadoLocal}
                    onChange={(e) => setResultadoLocal(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {partidoEditando.equipoVisitante?.nombre || 'Visitante'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={resultadoVisitante}
                    onChange={(e) => setResultadoVisitante(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPartidoEditando(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : 'Confirmar Resultado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaBracketTorneo;
