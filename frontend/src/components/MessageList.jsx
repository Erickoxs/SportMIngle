import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import api from '../utils/api';

const MessageList = ({ mensajes = [], idUsuarioActual, idSala }) => {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  const token = localStorage.getItem('token');

  const handleEliminarMensaje = async (idMensaje) => {
    try {
      await api.post('/api/chat/eliminar', null, {
        params: {
          idMensaje,
          idUsuario: idUsuarioActual,
          idSala,
          razon: 'usuario',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error.message);
    }
  };

  const formatearSeparadorFecha = (fechaStr) => {
    if (!fechaStr) return null;
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    if (fecha.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    }
    if (fecha.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    }
    return fecha.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
      year: fecha.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 bg-slate-50/80 space-y-1">
      {mensajes.length === 0 ? (
        <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-gray-400 select-none">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-3 shadow-xs">
            💬
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">¡Inicia la conversación!</h3>
          <p className="text-xs text-gray-500 max-w-xs">
            Coordina el punto de encuentro, equipos y detalles con los demás participantes.
          </p>
        </div>
      ) : (
        mensajes.map((msg, index) => {
          const separadorActual = formatearSeparadorFecha(msg.fechaEnvio);
          const separadorAnterior = index > 0 ? formatearSeparadorFecha(mensajes[index - 1].fechaEnvio) : null;
          const mostrarSeparador = separadorActual && separadorActual !== separadorAnterior;

          return (
            <React.Fragment key={msg.idMensaje || index}>
              {mostrarSeparador && (
                <div className="flex justify-center my-3 select-none">
                  <span className="bg-white/90 backdrop-blur-xs border border-gray-200/70 shadow-2xs text-gray-500 text-[11px] font-medium px-3 py-0.5 rounded-full">
                    {separadorActual}
                  </span>
                </div>
              )}
              <MessageItem
                mensaje={msg}
                esPropio={msg.idUsuario === idUsuarioActual}
                onEliminar={handleEliminarMensaje}
              />
            </React.Fragment>
          );
        })
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
