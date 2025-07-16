import React from 'react';
import { useNavigate } from 'react-router-dom';

const BotonInvitarJugador = ({ idClub }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/invitar-jugador/${idClub}`)}
      className="border-2 border-[#009b3a] bg-white text-black font-semibold px-6 py-2 rounded hover:bg-[#009b3a] hover:text-white transition"
    >
      Invitar al Club
    </button>
  );
};

export default BotonInvitarJugador;
