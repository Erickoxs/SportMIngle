import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Aquí defines y aplicas el ícono por defecto de Leaflet
const defaultIcon = L.icon({
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapContainer({ lat, lon, nombre }) {
  if (!lat || !lon) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800">Ubicación</h2>

      <div className="h-64 w-full rounded overflow-hidden">
        <LeafletMap center={[lat, lon]} zoom={15} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lon]}>
            <Popup>{nombre}</Popup>
          </Marker>
        </LeafletMap>
      </div>
    </div>
  );
}

export default MapContainer;
