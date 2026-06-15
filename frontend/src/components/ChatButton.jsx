// src/components/ChatButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';
import api from '../utils/api';

const ChatButton = ({ tipoSala, idReferencia }) => {
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
  className="bg-[#009b3a] hover:bg-green-800 text-white px-4 py-2 rounded-full shadow-md transition duration-200"
>
  Abrir Chat
</button>

  );
};

export default ChatButton;
