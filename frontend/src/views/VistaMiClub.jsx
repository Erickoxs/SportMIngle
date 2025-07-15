// src/views/VistaMiClub.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import LogoSportMingle from '../components/LogoSportMingle';
import BackArrow from '../components/BackArrow';
import BotonSolicitudes from '../components/BotonSolicitudes';
import BotonInvitarJugador from '../components/BotonInvitarJugador';

const VistaMiClub = () => {
  const { idClub } = useParams(); // 🔥 Importante para pasar el ID

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex items-center gap-4 mb-6">
        <BackArrow />
        <LogoSportMingle />
      </header>

      <h1 className="text-2xl font-bold text-center mb-6">Mi Club</h1>

      <div className="flex flex-col items-center gap-4">
        {/* 🔁 Pasamos el idClub como prop */}
        <BotonSolicitudes idClub={idClub} />
        <BotonInvitarJugador idClub={idClub} />
      </div>
    </div>
  );
};

export default VistaMiClub;
