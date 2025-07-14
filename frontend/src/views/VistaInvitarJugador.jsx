// src/views/VistaInvitarJugador.jsx
import React from 'react';
import BackArrow from '../components/BackArrow';
import InvitarClub from '../components/InvitarClub';

const VistaInvitarJugador = () => {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-2xl">
        <BackArrow />
        <h1 className="text-2xl font-bold mt-4 mb-6 text-center">Invitar Jugador al Club</h1>
        <InvitarClub />
      </div>
    </div>
  );
};

export default VistaInvitarJugador;
