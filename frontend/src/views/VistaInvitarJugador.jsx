// src/views/VistaInvitarJugador.jsx
import React from 'react';
import BackArrow from '../components/BackArrow';
import LogoSportMingle from '../components/LogoSportMingle';
import UserMenuDropdown from '../components/UserMenuDropdown';
import InvitarClub from '../components/InvitarClub';

const VistaInvitarJugador = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 pb-12">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BackArrow />
            <LogoSportMingle />
          </div>
          <UserMenuDropdown />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Invitar Jugadores al Club</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Comparte el enlace o el código QR para que cualquier deportista pueda sumarse a tu equipo.
            </p>
          </div>
          <InvitarClub />
        </div>
      </main>
    </div>
  );
};

export default VistaInvitarJugador;
