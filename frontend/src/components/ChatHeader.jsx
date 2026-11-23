import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ nombreSala, tipoSala }) => {
  const navigate = useNavigate();

  const getTipoLabel = () => {
    switch (tipoSala) {
      case 'partido':
        return 'Sala de Partido';
      case 'torneo':
        return 'Sala de Torneo';
      case 'club':
        return 'Chat del Club';
      case 'privado':
        return 'Chat Privado';
      default:
        return 'Chat en Vivo';
    }
  };

  const inicial = (nombreSala?.trim()?.charAt(0) || 'S').toUpperCase();

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-3 shadow-md flex items-center justify-between z-10">
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Volver"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-sm border border-white/30 shadow-inner">
            {inicial}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
            {nombreSala || 'Sala de Chat'}
          </h2>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="font-medium">{getTipoLabel()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 text-emerald-100 text-xs font-medium bg-white/10 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
        <span className="hidden sm:inline">Conectado</span>
      </div>
    </div>
  );
};

export default ChatHeader;
