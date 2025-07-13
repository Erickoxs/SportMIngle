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

  const token = localStorage.getItem('token');
  const decoded = decodeToken(token);
  const idUsuarioActual = decoded?.id;

  // ✅ Cargar sala y mensajes al inicio
  useEffect(() => {
    if (!idUsuarioActual) return;

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
      } catch (err) {
        console.error('[ERROR] Fallo al cargar sala o mensajes:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarSalaYMensajes();
  }, [idSala, idUsuarioActual, token]);

  // ✅ Conexión WebSocket
  // ✅ Conexión WebSocket
useEffect(() => {
  if (!idUsuarioActual) return;

  const socket = new SockJS('http://localhost:8080/ws-chat');
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[DEBUG] Conectado al WebSocket');
      
      stompClient.subscribe(`/topic/chat/${idSala}`, (mensaje) => {
        const nuevoMensaje = JSON.parse(mensaje.body);
        console.log('[DEBUG] Mensaje recibido vía WebSocket:', nuevoMensaje);

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
      });
    },
    onStompError: (frame) => {
      console.error('[ERROR] STOMP error:', frame.headers['message']);
    }
  });

  stompClient.activate();

  return () => {
    console.log('[DEBUG] Desconectando WebSocket');
    stompClient.deactivate();
  };
}, [idSala, idUsuarioActual]);


  const enviarMensaje = async (contenido) => {
    try {
      const res = await api.post(
        `/api/chat/enviar?idRemitente=${idUsuarioActual}&idSala=${idSala}`,
        { contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[DEBUG] Mensaje enviado vía HTTP:', res.data);
    } catch (err) {
      console.error('[ERROR] Error al enviar mensaje:', err);
    }
  };

  if (!idUsuarioActual) return <p className="p-4 text-red-500">Token inválido o expirado.</p>;
  if (cargando) return <p className="p-4">Cargando sala...</p>;
  if (!sala) return <p className="p-4">No se encontró la sala.</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader nombreSala={sala.nombreSala} />
      <MessageList mensajes={mensajes} idUsuarioActual={idUsuarioActual} idSala={idSala}/>
      <MessageInput onEnviar={enviarMensaje} />
    </div>
  );
};

export default SalaChat;
