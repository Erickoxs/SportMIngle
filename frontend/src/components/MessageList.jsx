import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import api from '../utils/api';

const MessageList = ({ mensajes, idUsuarioActual, idSala }) => {
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

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
      {mensajes.map((msg) => (
        <MessageItem
          key={msg.idMensaje}
          mensaje={msg}
          esPropio={msg.idUsuario === idUsuarioActual}
          onEliminar={handleEliminarMensaje}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
