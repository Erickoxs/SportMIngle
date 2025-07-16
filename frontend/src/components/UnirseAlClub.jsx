import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';
import api from '../utils/api';

const UnirseAlClub = () => {
  const { idClub } = useParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    const unirse = async () => {
      try {
        console.log('[DEPURACIÓN] Iniciando proceso de unión al club...');

        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('[DEPURACIÓN] Token no encontrado.');
          setEstado('no-logueado');
          return;
        }

        const decoded = decodeToken(token);
        console.log('[DEPURACIÓN] Token decodificado:', decoded);

        const idUsuario = decoded?.id;
        if (!idUsuario) {
          console.warn('[DEPURACIÓN] ID de usuario no presente en el token.');
          setEstado('token-invalido');
          return;
        }

        const payload = {
  club: {
    id: Number(idClub),
  },
  deportista: {
    idUsuario: Number(idUsuario),
  },
  rol: 'miembro',
};

console.log('[DEPURACIÓN] Enviando solicitud a /api/miembros con:', payload);

await api.post('/api/miembros', payload, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
        console.log('[DEPURACIÓN] Usuario unido exitosamente al club.');
        setEstado('ok');
        setTimeout(() => navigate(`/home`), 2000);
      } catch (error) {
        console.error('[DEPURACIÓN] Error al unirse al club:', error);

        if (error.response?.status === 409) {
          setEstado('ya-es-miembro');
        } else {
          setEstado('error');
        }
      }
    };

    unirse();
  }, [idClub, navigate]);

  return (
    <div className="pt-10 text-center">
      {estado === 'cargando' && <p>Uniéndote al club...</p>}
      {estado === 'ok' && <p>¡Te has unido al club! Redirigiendo...</p>}
      {estado === 'ya-es-miembro' && <p>Ya eres miembro del club. Redirigiendo...</p>}
      {estado === 'no-logueado' && <p>Debes iniciar sesión para unirte a un club.</p>}
      {estado === 'token-invalido' && <p>Token inválido. Inicia sesión nuevamente.</p>}
      {estado === 'error' && <p>Ocurrió un error al unirte al club.</p>}
    </div>
  );
};

export default UnirseAlClub;
