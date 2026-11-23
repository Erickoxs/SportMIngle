// src/views/VistaMiClub.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LogoSportMingle from '../components/LogoSportMingle';
import BackArrow from '../components/BackArrow';
import UserMenuDropdown from '../components/UserMenuDropdown';
import ListaSolicitudesClub from '../components/ListaSolicitudesClub';
import InvitarClub from '../components/InvitarClub';
import ChatButton from '../components/ChatButton';
import api from '../utils/api';

const VistaMiClub = () => {
  const { idClub } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [totalSolicitudes, setTotalSolicitudes] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [activeTab, setActiveTab] = useState('miembros'); // 'miembros' | 'solicitudes' | 'invitar'

  const token = localStorage.getItem('token');

  const cargarDatosClub = async () => {
    try {
      // 1. Obtener información del club
      const resClub = await api.get(`/api/clubes/${idClub}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClub(resClub.data);

      // 2. Obtener miembros del club
      const resMiembros = await api.get(`/api/miembros/club/${idClub}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMiembros(Array.isArray(resMiembros.data) ? resMiembros.data : []);

      // 3. Obtener solicitudes pendientes
      const resSolicitudes = await api.get(`/api/solicitudes/club/${idClub}/pendientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalSolicitudes(Array.isArray(resSolicitudes.data) ? resSolicitudes.data.length : 0);
    } catch (err) {
      console.error('Error al cargar datos del club:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosClub();
  }, [idClub]);

  const handleEliminarMiembro = async (idMiembro) => {
    if (!window.confirm('¿Seguro que deseas remover a este miembro del club?')) return;

    try {
      await api.delete(`/api/miembros/${idMiembro}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMiembros((prev) => prev.filter((m) => m.id !== idMiembro));
    } catch (err) {
      console.error('Error al eliminar miembro:', err);
      alert('No se pudo remover al miembro.');
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando panel del club...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BackArrow />
            <div className="hidden sm:block">
              <LogoSportMingle />
            </div>
          </div>

          <div className="sm:hidden">
            <LogoSportMingle />
          </div>

          <div className="flex items-center">
            <UserMenuDropdown />
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Hero Card del Club */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Logo o Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 shadow-inner shrink-0 flex items-center justify-center overflow-hidden">
              {club?.logoUrl ? (
                <img
                  src={club.logoUrl}
                  alt={club.nombre}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl font-extrabold text-white">
                  {(club?.nombre?.charAt(0) || 'C').toUpperCase()}
                </span>
              )}
            </div>

            {/* Info principal */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wide">
                  {club?.deporte || 'Deporte'}
                </span>
                <span className="bg-white/10 text-white/90 text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                  Panel de Administrador 🛡️
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
                {club?.nombre || 'Mi Club Deportivo'}
              </h1>

              {club?.descripcion && (
                <p className="text-emerald-100 text-sm max-w-2xl line-clamp-2">
                  {club.descripcion}
                </p>
              )}

              {/* Botón de Chat de la Sala */}
              <div className="pt-2 flex justify-center sm:justify-start">
                <ChatButton
                  tipoSala="club"
                  idReferencia={idClub}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-4 py-2 text-xs sm:text-sm rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15 max-w-md sm:max-w-none">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-emerald-200 uppercase font-semibold">Miembros Activos</p>
              <p className="text-xl sm:text-2xl font-black mt-1">{miembros.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-white/10 text-center sm:text-left">
              <p className="text-xs text-emerald-200 uppercase font-semibold">Solicitudes Pendientes</p>
              <p className="text-xl sm:text-2xl font-black mt-1 text-amber-300">
                {totalSolicitudes}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs gap-1">
          <button
            onClick={() => setActiveTab('miembros')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'miembros'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>👥</span>
            <span>Miembros ({miembros.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('solicitudes')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'solicitudes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📩</span>
            <span>Solicitudes</span>
            {totalSolicitudes > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'solicitudes' ? 'bg-amber-400 text-gray-900' : 'bg-amber-500 text-white'
              }`}>
                {totalSolicitudes}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('invitar')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invitar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🔗</span>
            <span>Invitar</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs">
          
          {/* TAB 1: MIEMBROS */}
          {activeTab === 'miembros' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Plantel del Club</h3>
                  <p className="text-xs text-gray-500">Deportistas inscritos y activos en tu club.</p>
                </div>
                <button
                  onClick={() => setActiveTab('invitar')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  <span>+ Invitar más</span>
                </button>
              </div>

              {miembros.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-gray-200">
                  <span className="text-3xl block mb-2">⚽</span>
                  <h4 className="text-sm font-bold text-gray-700">Aún no hay miembros en el club</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Invita a tus compañeros de equipo compartiendo el enlace o código QR.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {miembros.map((miembro) => {
                    const nombre = miembro.nombreDeportista || 'Deportista';
                    const inicial = (nombre.charAt(0) || 'D').toUpperCase();
                    const esAdmin = miembro.rol === 'ADMINISTRADOR' || miembro.rol === 'admin';

                    return (
                      <div
                        key={miembro.id}
                        className="p-3.5 rounded-2xl border border-gray-100 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-white hover:border-emerald-100 hover:shadow-xs transition"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {inicial}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{nombre}</p>
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                esAdmin
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {miembro.rol || 'Miembro'}
                            </span>
                          </div>
                        </div>

                        {!esAdmin && (
                          <button
                            onClick={() => handleEliminarMiembro(miembro.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remover miembro"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SOLICITUDES */}
          {activeTab === 'solicitudes' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Solicitudes de Ingreso</h3>
                <p className="text-xs text-gray-500">
                  Revisa y autoriza a los deportistas que desean unirse a tu club.
                </p>
              </div>
              <ListaSolicitudesClub idClub={idClub} onUpdate={cargarDatosClub} />
            </div>
          )}

          {/* TAB 3: INVITAR */}
          {activeTab === 'invitar' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100 text-center">
                <h3 className="text-base font-bold text-gray-900">Recluta Jugadores</h3>
                <p className="text-xs text-gray-500">
                  Comparte el link o muestra el código QR para que se unan a tu club en segundos.
                </p>
              </div>
              <InvitarClub idClub={idClub} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default VistaMiClub;
