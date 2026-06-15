import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const ListaSolicitudesClub = ({ idClub }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolicitudes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/api/solicitudes/club/${idClub}/pendientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setSolicitudes(res.data);
      } else {
        setSolicitudes([]);
      }
    } catch (error) {
      console.error('❌ Error al obtener solicitudes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const manejarAccion = async (idSolicitud, accion) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      await api.put(`/api/solicitudes/${idSolicitud}/${accion}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSolicitudes();
    } catch (error) {
      console.error(`❌ Error al ${accion} la solicitud:`, error.message);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [idClub]);

  if (loading) return <p className="p-4">Cargando solicitudes...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Solicitudes al Club</h2>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul className="space-y-4">
          {solicitudes.map((s) => (
            <li
              key={s.id}
              className="border p-4 rounded shadow-sm flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-semibold">{s.nombreUsuario || 'Usuario desconocido'}</p>
                <p className="text-sm text-gray-600">Estado: {s.estado}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => manejarAccion(s.id, 'aceptar')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => manejarAccion(s.id, 'rechazar')}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaSolicitudesClub;
