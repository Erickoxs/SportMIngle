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

  if (!idUsuarioActual) return <p>Token inválido o expirado.</p>;
  if (cargando) return <p>Cargando sala...</p>;

  return (
<div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader nombreSala={sala.nombreSala} />
      <MessageList mensajes={mensajes} idUsuarioActual={idUsuarioActual} idSala={idSala}/>
      <MessageInput onEnviar={enviarMensaje} />
    </div>
);

};

export default SalaChat;
