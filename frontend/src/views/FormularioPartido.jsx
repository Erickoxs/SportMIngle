import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import api from '../utils/api';
import MapaSelector from '../components/MapSelector';

const niveles = [
  'CUALQUIERA',
  'PRINCIPIANTE',
  'AMATEUR',
  'SEMIPROFESIONAL',
  'AVANZADO',
];

function FormularioPartido() {
  const [idDeporte, setDeporteId] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [latLon, setLatLon] = useState(null);
  const [maxJugadores, setMaxJugadores] = useState('');
  const [nivelRequerido, setNivelRequerido] = useState('CUALQUIERA');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latLon) {
      alert('Selecciona una ubicación en el mapa');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error('Error decodificando el token:', err);
      alert('Token inválido.');
      return;
    }

    const nuevoPartido = {
  idDeporte,
  fechaHora,
  lat: latLon.lat,
  lon: latLon.lon,
  maxJugadores: maxJugadores ? parseInt(maxJugadores) : null,
  nivelRequerido,
  descripcion,
  idOrganizador: userId,
};


    try {
      const response = await api.post('/api/partidos-informales', nuevoPartido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("LatLon antes de enviar:", latLon);
      setMensaje('✅ Partido creado con éxito');
      console.log('Respuesta del servidor:', response.data);

      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      setMensaje('❌ Error al crear el partido');
      console.error('Error al enviar:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-5"
    >
      <h2 className="text-2xl font-semibold text-[#009b3a] text-center">
        Crear Partido Informal
      </h2>

      {mensaje && (
        <div className="text-center text-sm font-medium text-gray-700">
          {mensaje}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID del Deporte
        </label>
        <input
          type="text"
          value={idDeporte}
          onChange={(e) => setDeporteId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha y Hora
        </label>
        <input
          type="datetime-local"
          value={fechaHora}
          onChange={(e) => setFechaHora(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona la ubicación en el mapa
        </label>
        <MapaSelector setLatLon={setLatLon} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Máximo de jugadores
        </label>
        <input
          type="number"
          value={maxJugadores}
          onChange={(e) => setMaxJugadores(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nivel Requerido
        </label>
        <select
          value={nivelRequerido}
          onChange={(e) => setNivelRequerido(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        >
          {niveles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          placeholder="Escribe una breve descripción del partido..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#009b3a] text-white font-semibold py-2 rounded hover:bg-[#007d2f] transition-colors"
      >
        Crear Partido
      </button>
    </form>
  );
}

export default FormularioPartido;
