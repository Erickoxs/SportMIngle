import React, { useState, useRef } from 'react';

const MessageItem = ({ mensaje, esPropio, onEliminar }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const touchTimeoutRef = useRef(null);

  const toggleOpciones = () => setMostrarOpciones(prev => !prev);

  const handleEliminar = () => {
    setMostrarOpciones(false);
    if (onEliminar) onEliminar(mensaje.idMensaje);
  };

  const handleTouchStart = () => {
    touchTimeoutRef.current = setTimeout(() => {
      setMostrarOpciones(true);
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimeoutRef.current);
  };

  return (
    <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Botón de tres puntos */}
        <div className="absolute top-1 right-1 z-20">
          <button onClick={toggleOpciones} className="text-white text-xs">
            ⋮
          </button>
        </div>

        {/* Menú contextual */}
        {mostrarOpciones && (
          <div className="absolute right-0 bottom-full mb-1 bg-white shadow-lg border rounded text-xs z-30">
            <button
              onClick={handleEliminar}
              className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-black"
            >
              Eliminar mensaje
            </button>
          </div>
        )}

        {/* Contenido del mensaje */}
        <div
          className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
            mensaje.eliminado ? 'bg-gray-300 text-gray-600 italic' : ''
          }`}
          style={{
            backgroundColor: esPropio && !mensaje.eliminado ? '#009b3a' : mensaje.eliminado ? '#e5e5e5' : '#f0f0f0',
            color: mensaje.eliminado ? '#666' : esPropio ? 'white' : 'black',
          }}
        >
          {mensaje.eliminado ? 'Se eliminó este mensaje' : mensaje.contenido}
          <div className="text-[10px] text-right mt-1 opacity-60">
            {new Date(mensaje.fechaEnvio).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
