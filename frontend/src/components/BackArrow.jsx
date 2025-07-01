import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackArrow({}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Regresa a la vista anterior
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
    >
      <img
        src="/izquierda.png" // Ruta relativa desde public
        alt="Volver"
        className="w-5 h-5"
      />
    </button>
  );
}

export default BackArrow;
