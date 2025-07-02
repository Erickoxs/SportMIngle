import React, { useState } from 'react';

const MessageInput = ({ onEnviar }) => {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mensaje.trim() !== '') {
      onEnviar(mensaje);
      setMensaje('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 bg-gray-100 border-t">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
        placeholder="Escribe un mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-r-lg text-black font-semibold"
        style={{ backgroundColor: '#ffdf00' }}
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;
