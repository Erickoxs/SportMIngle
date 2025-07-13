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
    console.log('--- ELIMINAR MENSAJE ---');
    console.log('Token:', token);
    console.log('idMensaje:', idMensaje);
    console.log('idUsuarioActual:', idUsuarioActual);

    try {
      const response = await api.post('/api/chat/eliminar', null, {
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

      console.log('Respuesta del backend:', response.data);
    } catch (error) {
      console.error('Error al eliminar el mensaje:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        console.error('Error al configurar la petición:', error.message);
      }
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
