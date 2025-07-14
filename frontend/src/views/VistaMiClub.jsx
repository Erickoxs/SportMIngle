// src/views/VistaMiClub.jsx
import React from 'react';
import LogoSportMingle from '../components/LogoSportMingle';
import BackArrow from '../components/BackArrow';
import BotonSolicitudes from '../components/BotonSolicitudes';
import BotonInvitarJugador from '../components/BotonInvitarJugador';

const VistaMiClub = () => {
  const handleSolicitudesClick = () => {
    console.log('Ir a solicitudes');
  };

  const handleInvitarClick = () => {
    console.log('Abrir modal de invitación');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center gap-4 mb-6">
        <BackArrow />
        <LogoSportMingle />
      </header>

      <h1 className="text-2xl font-bold text-center mb-6">Mi Club</h1>

      <div className="flex flex-col items-center gap-4">
        <BotonSolicitudes onClick={handleSolicitudesClick} />
        <BotonInvitarJugador onClick={handleInvitarClick} />
      </div>
    </div>
  );
};

export default VistaMiClub;
