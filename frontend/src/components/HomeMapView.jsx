import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { calcularDistancia } from '../utils/dateFilter';
import { formatearFechaHora, formatearFecha } from '../utils/format';

function MapAdjuster({ center, items }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    if (items && items.length > 0) {
      const bounds = L.latLngBounds(items.map((i) => [i.lat, i.lon]));
      if (center) {
        bounds.extend([center.lat, center.lon]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else if (center) {
      map.setView([center.lat, center.lon], 13);
    }
  }, [map, items, center]);

  return null;
}

const getSportEmoji = (deporte) => {
  switch (deporte) {
    case 'Baloncesto':
      return '🏀';
    case 'Tenis':
      return '🎾';
    case 'Voleibol':
      return '🏐';
    case 'Béisbol':
      return '⚾';
    case 'Natación':
      return '🏊';
    case 'Fútbol':
    default:
      return '⚽';
  }
};

const crearIconoDeporte = (deporte) => {
  const emoji = getSportEmoji(deporte);
  return L.divIcon({
    className: 'custom-sport-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #059669, #047857);
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        border: 2.5px solid white;
        cursor: pointer;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const iconoUsuario = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; opacity: 0.35; animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
      <div style="position: relative; width: 14px; height: 14px; background-color: #2563eb; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

function HomeMapView({ items = [], categoria, deporte, ubicacion }) {
  const navigate = useNavigate();

  const centro = ubicacion || { lat: 4.710989, lon: -74.07209 };

  // Filtrar items con coordenadas válidas
  const itemsConCoordenadas = items.filter(
    (item) => item && typeof item.lat === 'number' && typeof item.lon === 'number'
  );

  return (
    <div className="h-[460px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-200/90 relative z-0">
      <MapContainer
        center={[centro.lat, centro.lon]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAdjuster center={ubicacion} items={itemsConCoordenadas} />

        {/* Marcador del usuario */}
        {ubicacion && (
          <Marker position={[ubicacion.lat, ubicacion.lon]} icon={iconoUsuario}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-xs text-blue-700">📍 Tu ubicación actual</p>
                <p className="text-[11px] text-gray-500">Buscando eventos cercanos aquí</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de eventos vigentes */}
        {itemsConCoordenadas.map((item) => {
          const distancia = ubicacion
            ? calcularDistancia(ubicacion.lat, ubicacion.lon, item.lat, item.lon)
            : null;

          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lon]}
              icon={crearIconoDeporte(item.deporte || deporte)}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {categoria}
                    </span>
                    {distancia && (
                      <span className="text-[10px] font-semibold text-gray-500">
                        📍 {distancia}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 leading-tight">
                    {item.nombre || item.descripcion || 'Evento Deportivo'}
                  </h4>

                  {categoria === 'partidos' && item.fechaHora && (
                    <p className="text-xs text-gray-600">
                      🕒 {formatearFechaHora(item.fechaHora)}
                    </p>
                  )}

                  {categoria === 'torneos' && item.fechaInicio && (
                    <p className="text-xs text-gray-600">
                      🏆 Inicio: {formatearFecha(item.fechaInicio)}
                    </p>
                  )}

                  {item.direccion && (
                    <p className="text-[11px] text-gray-500 truncate" title={item.direccion}>
                      {item.direccion}
                    </p>
                  )}

                  <button
                    onClick={() => navigate(`/details/${categoria}/${item.id}`)}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-xs transition active:scale-95 text-center flex items-center justify-center gap-1"
                  >
                    <span>Ver detalles</span>
                    <span>→</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default HomeMapView;
