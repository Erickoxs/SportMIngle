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

        // Asignar URL según categoría
        switch (categoria) {
          case 'torneos':
            url = `/api/inscripciones/torneo/${id}`;
            break;
          case 'partidos-informales':
            url = `/api/jugadores/por-partido/${id}`;
            break;
          case 'clubes':
            url = `/api/miembros/club/${id}`;
            break;
          default:
            console.warn('❌ Categoría no reconocida:', categoria);
            return;
        }

        console.log('🔍 Solicitando inscripciones desde:', url);

        const res = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        console.log('📦 Respuesta del backend:', data);

        if (Array.isArray(data)) {
          setInscripciones(data);
        } else {
          console.warn('⚠️ La respuesta no es un arreglo. Tipo:', typeof data);
          setInscripciones([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar inscripciones:', err);
        setError('No se pudieron cargar las inscripciones.');
      } finally {
        setCargando(false);
      }
    };

    obtenerInscripciones();
  }, [categoria, id]);

  if (cargando) return <p className="text-center">Cargando inscripciones...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (inscripciones.length === 0) {
    return <p className="text-center text-gray-500">Aún no hay inscripciones.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">Inscripciones</h2>
      <ul className="space-y-2">
        {inscripciones.map((inscripcion, index) => (
          <li
            key={inscripcion.idInscripcion || inscripcion.idJugador || inscripcion.id || index}
            className="bg-gray-100 px-4 py-2 rounded shadow text-gray-700 text-sm"
          >
            {categoria === 'torneos' && (
              <>
                <strong>Club:</strong> {inscripcion.nombreClub || 'Desconocido'}
              </>
            )}
            {categoria === 'partidos-informales' && (
              <>
                <strong>Jugador:</strong> {inscripcion.nombreJugador || 'Desconocido'}
              </>
            )}
            {categoria === 'clubes' && (
              <>
                <strong>Miembro:</strong> {inscripcion.nombreDeportista|| 'Desconocido'}<br />
                <strong>Rol:</strong> {inscripcion.rol}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaInscripciones;
