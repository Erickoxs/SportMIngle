import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';

// Icono por defecto
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Componente que mueve la vista del mapa
function MoverVista({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 14);
    }
  }, [coords, map]);

  return null;
}

// Componente para agregar el marcador y detectar clics
function LocationMarker({ position, setPosition, setLatLon }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLatLon({ lat, lon: lng });
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

function MapaSelector({ setLatLon }) {
  const [position, setPosition] = useState(null);
  const [query, setQuery] = useState('');

  const handleBuscar = async () => {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);

      setPosition([parsedLat, parsedLon]);
      setLatLon({ lat: parsedLat, lon: parsedLon });
    }
  };

  return (
    <div>
      <div className="flex space-x-2 mb-2">
        <input
          type="text"
          placeholder="Buscar dirección"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleBuscar}
          className="bg-[#009b3a] text-white px-4 rounded"
        >
          Buscar
        </button>
      </div>

      <MapContainer
        center={[4.710989, -74.072090]} // Bogotá
        zoom={13}
        scrollWheelZoom
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MoverVista coords={position} />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          setLatLon={setLatLon}
        />
      </MapContainer>
    </div>
  );
}

export default MapaSelector;
