import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';
import api from '../utils/api';

function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [clubId, setClubId] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Obtener info del usuario desde el JWT
  const token = localStorage.getItem('token');
  const usuario = token ? decodeToken(token) : null;

  const nombre = usuario?.nombre || 'Usuario';
  const email = usuario?.sub || usuario?.email || '';
  const inicial = nombre.trim().charAt(0).toUpperCase() || 'U';

  // Verificar si es administrador/dueño de algún club
  useEffect(() => {
    if (!usuario?.id || !token) return;

    api.get(`/api/clubes/organizador/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data && res.data.id) {
          setClubId(res.data.id);
        }
      })
      .catch(() => {
        setClubId(null);
      });
  }, [usuario?.id, token]);

  // Cerrar al hacer clic fuera del dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#009b3a] transition"
        aria-label="Menú de usuario"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#009b3a] text-white font-bold flex items-center justify-center shadow-sm text-sm sm:text-base select-none">
          {inicial}
        </div>
        <span className="hidden sm:inline-block text-xs text-gray-500 font-semibold">
          ▼
        </span>
      </button>

      {/* Menú Flotante */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header con nombre y email */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#009b3a] font-extrabold flex items-center justify-center text-base shrink-0">
              {inicial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">
                {nombre}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {email}
              </p>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/mis-partidos');
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#009b3a] font-medium flex items-center gap-2.5 transition"
            >
              <span className="text-base">📅</span>
              <span>Mis Partidos</span>
            </button>

            {/* Administrar Mi Club si es organizador */}
            {clubId && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/mi-club/${clubId}`);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#009b3a] font-medium flex items-center gap-2.5 transition"
              >
                <span className="text-base">🛡️</span>
                <span>Administrar Mi Club</span>
              </button>
            )}
          </div>

          {/* Cerrar Sesión */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2.5 transition"
            >
              <span className="text-base">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenuDropdown;
