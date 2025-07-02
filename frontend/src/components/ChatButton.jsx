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

    console.log('[DEBUG] Intentando abrir sala de chat...');
    console.log('[DEBUG] tipoSala:', tipoSala);
    console.log('[DEBUG] idReferencia:', idReferencia);
    console.log('[DEBUG] Token:', token);

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

    console.log('[DEBUG] Respuesta del backend:', res.data);

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

    console.log("ID USUARIO: ", idUsuarioActual)

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

    console.log('[DEBUG] Participante registrado:', participanteRes.data);

    console.log(`[DEBUG] Redirigiendo a /chat/${salaId}`);
    navigate(`/chat/${salaId}`);
  } catch (error) {
    console.error('[ERROR] Fallo al abrir la sala de chat');

    if (error.response) {
      console.error('[ERROR] Código de respuesta:', error.response.status);
      console.error('[ERROR] Datos de respuesta:', error.response.data);
    } else if (error.request) {
      console.error('[ERROR] No hubo respuesta del servidor:', error.request);
    } else {
      console.error('[ERROR] Error al preparar la petición:', error.message);
    }

    alert('No se pudo abrir el chat. Revisa la consola para más detalles.');
  }
};

  return (
    <button
      onClick={abrirSalaChat}
      className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-700 transition duration-200"
    >
      Abrir Chat
    </button>
  );
};

export default ChatButton;
