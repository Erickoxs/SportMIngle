import React, { useState, useRef, useEffect } from 'react';

const MessageItem = ({ mensaje, esPropio, onEliminar }) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const menuRef = useRef(null);
  const touchTimeoutRef = useRef(null);

  const toggleOpciones = (e) => {
    e.stopPropagation();
    setMostrarOpciones((prev) => !prev);
  };

  const handleEliminar = (e) => {
    e.stopPropagation();
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

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    const handleClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarOpciones(false);
      }
    };
    if (mostrarOpciones) {
      document.addEventListener('click', handleClickAfuera);
    }
    return () => {
      document.removeEventListener('click', handleClickAfuera);
    };
  }, [mostrarOpciones]);

  const horaFormateada = mensaje.fechaEnvio
    ? new Date(mensaje.fechaEnvio).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className={`flex w-full ${esPropio ? 'justify-end' : 'justify-start'} my-1.5 px-1`}>
      <div
        className="relative group max-w-[85%] sm:max-w-md"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenido del mensaje */}
        <div
          className={`relative px-4 py-2.5 shadow-xs transition-all ${
            mensaje.eliminado
              ? 'bg-gray-100/90 text-gray-400 italic rounded-2xl border border-dashed border-gray-200 text-xs'
              : esPropio
              ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-xs'
              : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-xs shadow-xs'
          }`}
        >
          {/* Botón de tres puntos sutil (solo mensajes propios no eliminados) */}
          {esPropio && !mensaje.eliminado && onEliminar && (
            <button
              onClick={toggleOpciones}
              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-opacity"
              title="Opciones"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          )}

          {mensaje.eliminado ? (
            <div className="flex items-center space-x-1.5 py-0.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Se eliminó este mensaje</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed break-words whitespace-pre-wrap pr-2">
              {mensaje.contenido}
            </div>
          )}

          {/* Pie del mensaje: Hora y estado */}
          <div
            className={`flex items-center justify-end space-x-1 mt-1 text-[10px] select-none ${
              mensaje.eliminado
                ? 'text-gray-400'
                : esPropio
                ? 'text-emerald-100/90'
                : 'text-gray-400'
            }`}
          >
            <span>{horaFormateada}</span>
            {esPropio && !mensaje.eliminado && (
              <svg className="w-3 h-3 text-emerald-200 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Menú contextual flotante */}
        {mostrarOpciones && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-gray-100 rounded-xl py-1 text-xs z-30 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              onClick={handleEliminar}
              className="flex items-center space-x-2 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 text-left font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Eliminar mensaje</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
