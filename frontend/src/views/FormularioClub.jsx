import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
import MapaSelector from '../components/MapSelector';

function FormularioClub() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFundacion, setFechaFundacion] = useState('');
  const [idDeporte, setIdDeporte] = useState('');
  const [latLon, setLatLon] = useState(null);
  const [logo, setLogo] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latLon) {
      alert('Selecciona una ubicación en el mapa');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      alert('Token inválido');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('fechaFundacion', fechaFundacion);
    formData.append('id_deporte', idDeporte);
    formData.append('id_usuario_administrador', userId);
    formData.append('lat', latLon.lat);
    formData.append('lon', latLon.lon);
    formData.append('logo', logo);

    try {
      await api.post('/api/clubes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('✅ Club creado con éxito');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear el club');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-5"
    >
      <h2 className="text-2xl font-semibold text-[#009b3a] text-center">
        Crear Club
      </h2>

      {mensaje && (
        <div className="text-center text-sm font-medium text-gray-700">
          {mensaje}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Club
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          required
        />
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
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Fundación
        </label>
        <input
          type="date"
          value={fechaFundacion}
          onChange={(e) => setFechaFundacion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID del Deporte
        </label>
        <input
          type="text"
          value={idDeporte}
          onChange={(e) => setIdDeporte(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ubicación del Club
        </label>
        <MapaSelector setLatLon={setLatLon} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo del Club
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#009b3a] text-white font-semibold py-2 rounded hover:bg-[#007d2f] transition-colors"
      >
        Crear Club
      </button>
    </form>
  );
}

export default FormularioClub;
