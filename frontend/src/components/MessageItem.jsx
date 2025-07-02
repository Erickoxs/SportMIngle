import React from 'react';

const MessageItem = ({ mensaje, esPropio }) => {
  return (
    <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow`}
        style={{
          backgroundColor: esPropio ? '#009b3a' : '#f0f0f0',
          color: esPropio ? 'white' : 'black',
        }}
      >
        {mensaje.contenido}
        <div className="text-[10px] text-right mt-1 opacity-60">
          {new Date(mensaje.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
