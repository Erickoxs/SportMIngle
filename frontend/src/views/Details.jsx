import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Componentes
import ImagenContainer from '../components/ImagenContainer';
import BackArrow from '../components/BackArrow';
import InfoSection from '../components/InfoSection';
import MapContainer from '../components/MapContainer';
import LogoSportMingle from '../components/LogoSportMingle';
import BotonInscribirse from '../components/BotonInscribirse';
import ListaInscripciones from '../components/InscriptionList';
import ChatButton from '../components/ChatButton';
import UserMenuDropdown from '../components/UserMenuDropdown';

// Utilidades
import { obtenerDireccion } from '../utils/geoLocationUtil';

// Axios personalizado
import api from '../utils/api';

function Details() {
  const { categoria, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await api.get(`/api/${categoria}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        if (data && data.lat && data.lon) {
          const direccion = await obtenerDireccion(data.lat, data.lon);
          data.direccion = direccion;
        }

        setItem(data);
      } catch (err) {
        setError('No se pudo cargar la información del evento.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalle();
  }, [categoria, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <span className="text-4xl mb-3 block">⚠️</span>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Algo salió mal</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'No se encontró el contenido solicitado.'}</p>
          <div className="flex justify-center">
            <BackArrow />
          </div>
        </div>
      </div>
    );
  }

  const itemId = item.id || item.idPartido || item.idClub || item.idTorneo;

  // Comprobar si el torneo ya ha comenzado (o está en progreso/finalizado)
  const torneoHaComenzado =
    categoria === 'torneos' &&
    (item?.estado === 'en_progreso' ||
      item?.estado === 'finalizado' ||
      (item?.fechaInicio && new Date(item.fechaInicio) <= new Date()));

  return (
    <div className="min-h-screen bg-slate-50/70 pb-12">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

      {/* Main Content Responsive: Mobile First */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Main Column (Hero Image, Info, Map) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Hero Image */}
            <ImagenContainer categoria={categoria} item={item} />

            {/* Mobile Actions Card: Visible on mobile/tablet directly under hero image */}
            <div className="lg:hidden bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              {/* Botón Ver Bracket si el torneo ya comenzó */}
              {torneoHaComenzado && (
                <button
                  onClick={() => navigate(`/torneo/${itemId}/bracket`)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  <span className="text-xl">🏆</span>
                  <span>Ver Bracket del Torneo</span>
                </button>
              )}

              <BotonInscribirse
                categoria={categoria}
                idItem={itemId}
                deporteTorneo={item.deporte}
                className="w-full text-center"
              />
              <ChatButton
                tipoSala={categoria}
                idReferencia={itemId}
                className="w-full"
              />
            </div>

            {/* Structured Info Section */}
            <InfoSection item={item} />

            {/* Location / Map Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">📍</span>
                <h3 className="font-semibold text-gray-900">Ubicación del evento</h3>
              </div>
              <MapContainer lat={item.lat} lon={item.lon} nombre={item.nombre} />
            </div>

            {/* Mobile Participants: On mobile renders below map */}
            <div className="lg:hidden">
              <ListaInscripciones categoria={categoria} id={id} />
            </div>
          </div>

          {/* Desktop Sticky Sidebar (Actions & Participants) */}
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
            {/* Action Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {categoria}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 line-clamp-2">
                  {item.nombre || 'Detalle del Evento'}
                </h2>
                {item.precio !== undefined && (
                  <p className="text-2xl font-black text-gray-900 mt-2">
                    {item.precio === 0 || item.precio === null ? 'Gratis' : `$${item.precio}`}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-1">
                {/* Botón Ver Bracket si el torneo ya comenzó */}
                {torneoHaComenzado && (
                  <button
                    onClick={() => navigate(`/torneo/${itemId}/bracket`)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                  >
                    <span className="text-xl">🏆</span>
                    <span>Ver Bracket del Torneo</span>
                  </button>
                )}

                <BotonInscribirse
                  categoria={categoria}
                  idItem={itemId}
                  deporteTorneo={item.deporte}
                  className="w-full justify-center text-center"
                />

                <ChatButton
                  tipoSala={categoria}
                  idReferencia={itemId}
                  className="w-full justify-center"
                />
              </div>
            </div>

            {/* Inscriptions Card in Desktop Sidebar */}
            <ListaInscripciones categoria={categoria} id={id} />
          </aside>

        </div>
      </main>
    </div>
  );
}

export default Details;
