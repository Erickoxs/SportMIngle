import React from 'react';
import { useNavigate } from 'react-router-dom';

const BotonSolicitudes = ({ idClub }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!idClub) {
      console.warn('⚠️ idClub no disponible');
      return;
    }
    navigate(`/solicitudes/${idClub}`);
  };

  return (
    <button
      onClick={handleClick}
      className="border-2 border-[#009b3a] bg-white text-black font-semibold px-6 py-2 rounded hover:bg-[#009b3a] hover:text-white transition"
    >
      Solicitudes de Jugadores
    </button>
  );
};

export default BotonSolicitudes;
