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
    <div className="flex justify-start ml-6 mt-2">
      <button
        onClick={handleClick}
        className="border border-yellow-300 text-black font-semibold py-2 px-4 rounded transition duration-200 hover:bg-yellow-300 hover:text-white"
      >
        Mi Club
      </button>
    </div>
  );
};

export default BotonMiClub;
