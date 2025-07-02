import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ mensajes, idUsuarioActual }) => {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 bg-white">
      {mensajes.map((msg) => (
        <MessageItem
          key={msg.idMensaje}
          mensaje={msg}
          esPropio={msg.idUsuario === idUsuarioActual}

        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
