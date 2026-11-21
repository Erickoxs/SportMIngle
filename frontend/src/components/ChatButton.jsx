// src/components/ChatButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';
import api from '../utils/api';

const ChatButton = ({ tipoSala, idReferencia, className = '' }) => {
  const navigate = useNavigate();

 const abrirSalaChat = async () => {
  try {
    const token = localStorage.getItem('token');
      const decoded = decodeToken(token);
      const idUsuarioActual = decoded?.id;

    const res = await api.post(
      '/api/salas/abrir',
      { tipoSala, idReferencia },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const salaId = res.data.idSala;
    if (!salaId) throw new Error('No se recibió idSala en la respuesta.');

    // Obtener id del usuario desde el token o desde tu contexto
     // Ajusta según tu implementación real

    // Agregar participante a la sala
    const participantePayload = {
      salaChat: { idSala: salaId },
      usuario: { idUsuario: idUsuarioActual },
      ultimaVista: null,
    };

    const participanteRes = await api.post(
      '/api/participantes',
      participantePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    navigate(`/chat/${salaId}`);
  } catch (error) {
    console.error('[ERROR] Fallo al abrir la sala de chat:', error.message);
    alert('No se pudo abrir el chat. Revisa la consola para más detalles.');
  }
};

  return (
    <button
      onClick={abrirSalaChat}
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-[0.98] transition-all duration-200 shadow-sm ${className}`}
    >
      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span>Abrir Chat de la Sala</span>
    </button>
  );
};

export default ChatButton;
