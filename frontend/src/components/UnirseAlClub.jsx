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
        const token = localStorage.getItem('token');
        if (!token) {
          setEstado('no-logueado');
          return;
        }

        const decoded = decodeToken(token);

        const idUsuario = decoded?.id;
        if (!idUsuario) {
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

await api.post('/api/miembros', payload, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
        setEstado('ok');
        setTimeout(() => navigate(`/home`), 2000);
      } catch (error) {
        console.error('[ERROR] Error al unirse al club:', error.message);

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
