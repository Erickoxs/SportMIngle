import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';
import { formatearFechaHora } from '../utils/format';
import { obtenerDireccion } from '../utils/geoLocationUtil';
import BackArrow from '../components/BackArrow';
import LogoSportMingle from '../components/LogoSportMingle';

const SPORT_EMOJIS = {
  Fútbol: '⚽',
  Baloncesto: '🏀',
  Voleibol: '🏐',
  Tenis: '🎾',
  Pádel: '🎾',
  Running: '🏃',
};

function VistaMisPartidos() {
  const navigate = useNavigate();
  const [partidos, setPartidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pestaña, setPestaña] = useState('proximos'); // 'proximos' | 'historial'
  const [cancelandoId, setCancelandoId] = useState(null);

  useEffect(() => {
    cargarPartidos();
  }, []);

  const cargarPartidos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const decoded = decodeToken(token);
    const idUsuario = decoded?.id;
    if (!idUsuario) {
      setError('Sesión inválida. Vuelve a iniciar sesión.');
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      const res = await api.get(`/api/partidos/mis-partidos/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const partidosData = res.data || [];

      // Cargar direcciones geocodificadas en paralelo
      const partidosConDireccion = await Promise.all(
        partidosData.map(async (p) => {
          let direccion = 'Ubicación seleccionada en mapa';
          if (p.lat && p.lon) {
            try {
              direccion = await obtenerDireccion(p.lat, p.lon);
            } catch {
              // fallback silencioso
            }
          }
          return { ...p, direccion };
        })
      );

      setPartidos(partidosConDireccion);
    } catch (err) {
      console.error('Error al cargar mis partidos:', err);
      setError('No se pudieron cargar tus partidos. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const abrirChat = async (idPartido) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = decodeToken(token);
      const idUsuarioActual = decoded?.id;

      const res = await api.post(
        '/api/salas/abrir',
        { tipoSala: 'partidos', idReferencia: idPartido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const salaId = res.data?.idSala;
      if (!salaId) throw new Error('No se recibió idSala.');

      // Asegurar participante
      await api.post(
        '/api/participantes',
        {
          salaChat: { idSala: salaId },
          usuario: { idUsuario: idUsuarioActual },
          ultimaVista: null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {}); // Si ya es participante, continúa

      navigate(`/chat/${salaId}`);
    } catch (err) {
      console.error('Error al abrir chat:', err);
      alert('No se pudo abrir el chat de este partido.');
    }
  };

  const cancelarInscripcion = async (partido) => {
    if (!window.confirm(`¿Seguro que deseas cancelar tu inscripción a este partido de ${partido.deporte}?`)) {
      return;
    }

    try {
      setCancelandoId(partido.idPartido);
      const token = localStorage.getItem('token');
      await api.delete(`/api/jugadores/${partido.idInscripcion}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remover de la lista local
      setPartidos((prev) => prev.filter((p) => p.idPartido !== partido.idPartido));
      alert('Inscripción cancelada exitosamente.');
    } catch (err) {
      console.error('Error al cancelar inscripción:', err);
      alert('No se pudo cancelar la inscripción. Intenta más tarde.');
    } finally {
      setCancelandoId(null);
    }
  };

  // Separar en próximos y pasados
  const proximos = partidos.filter((p) => !p.esPasado);
  const historial = partidos.filter((p) => p.esPasado);
  const listaActual = pestaña === 'proximos' ? proximos : historial;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <BackArrow onClick={() => navigate('/home')} />
        <LogoSportMingle />
        <div className="w-10"></div> {/* espaciador para centrar logo */}
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">📅 Mis Partidos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona tus partidos inscritos y tus convocatorias organizadas.
        </p>
      </div>

      {/* Selector de Pestañas (Tabs) */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setPestaña('proximos')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              pestaña === 'proximos'
                ? 'bg-white text-[#009b3a] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚽ Próximos ({proximos.length})
          </button>
          <button
            onClick={() => setPestaña('historial')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              pestaña === 'historial'
                ? 'bg-white text-[#009b3a] shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⏱️ Historial ({historial.length})
          </button>
        </div>
      </div>

      {/* Estados de carga / error */}
      {cargando && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#009b3a] mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando tus partidos...</p>
        </div>
      )}

      {error && !cargando && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
          {error}
        </div>
      )}

      {/* Lista vacía */}
      {!cargando && !error && listaActual.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-5xl mb-4">
            {pestaña === 'proximos' ? '⚽' : '📜'}
          </div>
          <h3 className="text-lg font-bold text-gray-700">
            {pestaña === 'proximos'
              ? 'No tienes partidos próximos programados'
              : 'Aún no tienes partidos en tu historial'}
          </h3>
          <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
            {pestaña === 'proximos'
              ? 'Explora el mapa y únete a un encuentro casual con deportistas de tu zona.'
              : 'Los partidos que juegues quedarán guardados aquí automáticamente.'}
          </p>
          {pestaña === 'proximos' && (
            <button
              onClick={() => navigate('/home')}
              className="mt-6 bg-[#009b3a] hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-full shadow transition"
            >
              Explorar Partidos Cercanos
            </button>
          )}
        </div>
      )}

      {/* Tarjetas de Partidos */}
      {!cargando && !error && listaActual.length > 0 && (
        <div className="space-y-4">
          {listaActual.map((partido) => {
            const emoji = SPORT_EMOJIS[partido.deporte] || '🏅';

            return (
              <div
                key={partido.idPartido}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
              >
                {/* Info Principal */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-extrabold text-gray-800">
                      {emoji} {partido.deporte}
                    </span>

                    {/* Badge Rol */}
                    {partido.soyOrganizador ? (
                      <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                        👑 Organizador
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                        🏃 Jugador
                      </span>
                    )}

                    {/* Badge Estado */}
                    {partido.esPasado ? (
                      <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                        Finalizado
                      </span>
                    ) : (
                      <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                        Próximo
                      </span>
                    )}
                  </div>

                  {partido.descripcion && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {partido.descripcion}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span>⏰</span>
                      <strong className="text-gray-700">
                        {formatearFechaHora(partido.fechaHora)}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span className="truncate">{partido.direccion}</span>
                    </div>
                    {partido.nivelRequerido && (
                      <div className="flex items-center gap-1.5">
                        <span>🎯</span>
                        <span>Nivel: <strong className="text-gray-700">{partido.nivelRequerido}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => abrirChat(partido.idPartido)}
                    className="flex-1 md:flex-none bg-[#009b3a] hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    💬 Chat
                  </button>

                  <button
                    onClick={() => navigate(`/details/partidos/${partido.idPartido}`)}
                    className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition text-center"
                  >
                    Ver Detalle
                  </button>

                  {/* Botón cancelar inscripción (solo para jugadores en partidos futuros) */}
                  {!partido.soyOrganizador && !partido.esPasado && partido.idInscripcion && (
                    <button
                      onClick={() => cancelarInscripcion(partido)}
                      disabled={cancelandoId === partido.idPartido}
                      className="flex-1 md:flex-none border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                      {cancelandoId === partido.idPartido ? 'Cancelando...' : 'Desinscribirme'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VistaMisPartidos;
