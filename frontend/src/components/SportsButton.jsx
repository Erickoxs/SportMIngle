import React from 'react';

function BotonDeporte({ nombre, icono, activo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
  min-w-max
  flex items-center gap-2 px-3 py-1 rounded focus:outline-none transition duration-200
  ${activo
    ? 'bg-yellow-300 text-white'
    : 'bg-white text-[var(--color-secondary)] hover:bg-yellow-300 hover:text-white'}
`}
    >
      <img
        src={icono}
        alt={nombre}
        className="w-5 h-5 object-contain"
        style={{ filter: activo ? 'brightness(0) invert(1)' : 'none' }}
      />
      {nombre}
    </button>
  );
}

export default BotonDeporte;
