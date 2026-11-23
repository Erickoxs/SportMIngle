// src/components/BotonMiClub.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';

const BotonMiClub = ({ visible }) => {
  const [clubId, setClubId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decoded = decodeToken(token);
    const idUsuario = decoded?.id;

    if (!idUsuario) return;

    api.get(`/api/clubes/organizador/${idUsuario}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data && res.data.id) {
          setClubId(res.data.id);
        }
      })
      .catch((err) => {
        console.warn('⚠️ No es organizador de ningún club', err);
        setClubId(null);
      });
  }, []);

  const handleClick = () => {
    if (clubId) {
      navigate(`/mi-club/${clubId}`);
    }
  };

  if (!visible || !clubId) return null;

  return (
    <div className="flex justify-start ml-4 sm:ml-6 mt-3">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow-md active:scale-95 transition-all"
      >
        <span>🛡️</span>
        <span>Panel de Mi Club</span>
      </button>
    </div>
  );
};

export default BotonMiClub;
