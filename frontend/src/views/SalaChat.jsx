// src/pages/SalaChat.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';

const SalaChat = () => {
  const { idSala } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [sala, setSala] = useState(null);
  const [cargando, setCargando] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  const idUsuarioActual = decoded?.id;

  console.log('[DEBUG] idSala desde URL:', idSala);
  console.log('[DEBUG] Token:', token);
  console.log('[DEBUG] Decodificado:', decoded);
  console.log('[DEBUG] idUsuarioActual:', idUsuarioActual);

  useEffect(() => {
    if (!idUsuarioActual) {
      console.warn('[DEBUG] Usuario no autenticado. Abortando carga.');
      return;
    }

    const cargarSalaYMensajes = async () => {
      console.log('[DEBUG] Iniciando carga de sala y mensajes...');

      try {
        console.log('[DEBUG] Solicitando sala:', `/api/salas/${idSala}`);
        const resSala = await api.get(`/api/salas/${idSala}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSala(resSala.data);
        console.log('[DEBUG] Sala cargada:', resSala.data);

        console.log('[DEBUG] Solicitando mensajes:', `/api/chat/mensajes/${idSala}`);
        const resMensajes = await api.get(`/api/chat/mensajes/${idSala}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensajes(resMensajes.data);
        console.log('[DEBUG] Mensajes cargados:', resMensajes.data);

        console.log('[DEBUG] Enviando PUT para marcar última vista');
        await api.put(
          `/api/chat/ultima-vista?idUsuario=${idUsuarioActual}&idSala=${idSala}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('[DEBUG] Última vista actualizada.');
      } catch (err) {
        console.error('[ERROR] Fallo al cargar sala o mensajes:', err);
      } finally {
        setCargando(false);
        console.log('[DEBUG] Finalizado proceso de carga.');
      }
    };

    cargarSalaYMensajes();
  }, [idSala, idUsuarioActual, token]);

  const enviarMensaje = async (contenido) => {
    console.log('[DEBUG] Enviando mensaje:', contenido);

    try {
      const res = await api.post(
        `/api/chat/enviar?idRemitente=${idUsuarioActual}&idSala=${idSala}`,
        { contenido },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('[DEBUG] Mensaje enviado exitosamente:', res.data);
      setMensajes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('[ERROR] Error al enviar mensaje:', err);
    }
  };

  if (!idUsuarioActual) {
    console.warn('[DEBUG] Token no válido o expirado. No se puede renderizar chat.');
    return <p className="p-4 text-red-500">Token inválido o expirado.</p>;
  }

  if (cargando) {
    console.log('[DEBUG] Mostrando loader...');
    return <p className="p-4">Cargando sala...</p>;
  }

  if (!sala) {
    console.warn('[DEBUG] Sala no encontrada.');
    return <p className="p-4">No se encontró la sala.</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader nombreSala={sala.nombreSala} />
      <MessageList mensajes={mensajes} idUsuarioActual={idUsuarioActual} />
      <MessageInput onEnviar={enviarMensaje} />
    </div>
  );
};

export default SalaChat;
