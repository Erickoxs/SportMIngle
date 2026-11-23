import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const ListaSolicitudesClub = ({ idClub: propIdClub, onUpdate }) => {
  const params = useParams();
  const idClub = propIdClub || params.idClub;

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const fetchSolicitudes = async () => {
    const token = localStorage.getItem('token');
    if (!token || !idClub) {
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
    if (!token) return;

    setProcesandoId(idSolicitud);

    try {
      await api.put(`/api/solicitudes/${idSolicitud}/${accion}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualizar lista local
      setSolicitudes((prev) => prev.filter((s) => s.id !== idSolicitud));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(`❌ Error al ${accion} la solicitud:`, error.message);
      alert(`No se pudo ${accion} la solicitud.`);
    } finally {
      setProcesandoId(null);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [idClub]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 space-x-2">
        <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span className="text-sm font-medium">Cargando solicitudes...</span>
      </div>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-gray-200">
        <span className="text-3xl block mb-2">📬</span>
        <h4 className="text-sm font-bold text-gray-700">No hay solicitudes pendientes</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Cuando otros deportistas soliciten unirse a tu club, aparecerán aquí para que los aceptes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {solicitudes.map((s) => {
        const nombre = s.nombreUsuario || 'Usuario aspirante';
        const inicial = (nombre.charAt(0) || 'U').toUpperCase();
        const enProceso = procesandoId === s.id;

        return (
          <div
            key={s.id}
            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-100 transition"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                {inicial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{nombre}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="capitalize">{s.estado || 'Pendiente'}</span>
                  {s.esInvitacion && (
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                      Invitación
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                disabled={enProceso}
                onClick={() => manejarAccion(s.id, 'aceptar')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition active:scale-95 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Aceptar</span>
              </button>

              <button
                disabled={enProceso}
                onClick={() => manejarAccion(s.id, 'rechazar')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition active:scale-95 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Rechazar</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaSolicitudesClub;
