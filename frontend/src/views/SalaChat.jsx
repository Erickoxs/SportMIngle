// src/pages/SalaChat.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SalaChat = () => {
  const { idSala } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [sala, setSala] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [stompClient, setStompClient] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  const idUsuarioActual = decoded?.id;

  // 🔹 Cargar sala y mensajes iniciales
  useEffect(() => {
    const cargarSalaYMensajes = async () => {
      try {
        const resSala = await api.get(`/api/salas/${idSala}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSala(resSala.data);

        const resMensajes = await api.get(`/api/chat/mensajes/${idSala}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMensajes(resMensajes.data);

        await api.put(
          `/api/chat/ultima-vista?idUsuario=${idUsuarioActual}&idSala=${idSala}`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('[ERROR] Cargando sala o mensajes:', error.message);
      } finally {
        setCargando(false);
      }
    };

    if (idUsuarioActual) {
      cargarSalaYMensajes();
    }
  }, [idSala, idUsuarioActual, token]);

  // 🔹 Conectar WebSocket
  useEffect(() => {
    if (!idUsuarioActual) return;

    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws-chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Escuchar mensajes en la sala
        client.subscribe(`/topic/chat/${idSala}`, (mensaje) => {
          try {
            const nuevoMensaje = JSON.parse(mensaje.body);

            if (nuevoMensaje.tipo === 'MENSAJE_ELIMINADO') {
              setMensajes((prev) =>
                prev.map((m) =>
                  m.idMensaje === nuevoMensaje.idMensaje
                    ? { ...m, eliminado: true }
                    : m
                )
              );
            } else {
              setMensajes((prev) => [...prev, nuevoMensaje]);
            }
          } catch (err) {
            console.error('[ERROR] Procesando mensaje WS:', err.message);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[ERROR] STOMP:', frame.headers['message']);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [idSala, idUsuarioActual]);

  // 🔹 Enviar mensaje por WS
  const enviarMensaje = (contenido) => {
    if (!contenido.trim()) return; // evitar mensajes vacíos
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/chat/enviar/${idSala}`,
        body: JSON.stringify({
          idRemitente: idUsuarioActual,
          contenido: contenido.trim(),
        }),
      });
    }
  };

  if (!idUsuarioActual) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-rose-600 font-medium">Sesión inválida o expirada. Por favor vuelve a iniciar sesión.</p>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-3"></div>
        <p className="text-gray-600 text-sm font-medium">Cargando sala de chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-slate-100 flex flex-col justify-center items-center lg:p-4">
      <div className="w-full max-w-4xl h-[100dvh] lg:h-[92vh] flex flex-col bg-white shadow-xl lg:rounded-2xl overflow-hidden border-0 lg:border border-gray-200">
        <ChatHeader nombreSala={sala?.nombreSala} tipoSala={sala?.tipoSala} />
        <MessageList mensajes={mensajes} idUsuarioActual={idUsuarioActual} idSala={idSala} />
        <MessageInput onEnviar={enviarMensaje} />
      </div>
    </div>
  );
};

export default SalaChat;
