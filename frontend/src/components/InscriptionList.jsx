import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const ListaInscripciones = ({ categoria, id }) => {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerInscripciones = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = '';

        switch (categoria) {
          case 'torneos':
            url = `/api/inscripciones/torneo/${id}`;
            break;
          case 'partidos':
            url = `/api/jugadores/por-partido/${id}`;
            break;
          case 'clubes':
            url = `/api/miembros/club/${id}`;
            break;
          default:
            return;
        }

        const res = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        if (Array.isArray(data)) {
          setInscripciones(data);
        } else {
          setInscripciones([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar inscripciones:', err.message);
        setError('No se pudieron cargar las inscripciones.');
      } finally {
        setCargando(false);
      }
    };

    obtenerInscripciones();
  }, [categoria, id]);

  const tituloPorCategoria = {
    torneos: 'Clubes Inscritos',
    partidos: 'Jugadores Confirmados',
    clubes: 'Miembros del Club',
  };

  const getNombre = (item) => {
    if (categoria === 'torneos') return item.nombreClub || 'Club anónimo';
    if (categoria === 'partidos') return item.nombreJugador || 'Jugador anónimo';
    return item.nombreDeportista || 'Miembro anónimo';
  };

  const getSubtitulo = (item) => {
    if (categoria === 'clubes' && item.rol) return `Rol: ${item.rol}`;
    return null;
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center space-x-3 text-gray-500">
        <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="text-sm font-medium">Cargando participantes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-lg">👥</span>
          <h2 className="text-base font-semibold text-gray-800">
            {tituloPorCategoria[categoria] || 'Inscripciones'}
          </h2>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {inscripciones.length} {inscripciones.length === 1 ? 'inscrito' : 'inscritos'}
        </span>
      </div>

      {inscripciones.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">Aún no hay inscripciones registradas.</p>
          <p className="text-xs text-gray-400 mt-1">¡Sé el primero en unirte!</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-gray-50 max-h-72 overflow-y-auto pr-1">
          {inscripciones.map((inscripcion, index) => {
            const nombre = getNombre(inscripcion);
            const subtitulo = getSubtitulo(inscripcion);
            const initial = (nombre.charAt(0) || '?').toUpperCase();

            return (
              <li
                key={inscripcion.idInscripcion || inscripcion.idJugador || inscripcion.id || index}
                className="py-2.5 flex items-center space-x-3 hover:bg-gray-50/80 px-2 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{nombre}</p>
                  {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListaInscripciones;
