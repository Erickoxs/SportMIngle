import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BackArrow from '../components/BackArrow';
import api from '../utils/api';
import MapaSelector from '../components/MapSelector';

function FormularioTorneo() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idDeporte, setIdDeporte] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [latLon, setLatLon] = useState(null);
  const [numeroFases, setNumeroFases] = useState('');
  const [premios, setPremios] = useState('');
  const [costoInscripcion, setCostoInscripcion] = useState('');
  const [maxEquipos, setMaxEquipos] = useState('');
  const [estado, setEstado] = useState('inscripciones');
  const [imagenTorneo, setImagenTorneo] = useState(null);

  const [mensaje, setMensaje] = useState(null);

  const estados = ['inscripciones', 'en_progreso', 'finalizado', 'cancelado'];

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
    formData.append('idDeporte', idDeporte);
    formData.append('fechaInicio', fechaInicio);
    formData.append('fechaFin', fechaFin);
    formData.append('lat', latLon.lat);
    formData.append('lon', latLon.lon);
    formData.append('numeroFases', numeroFases);
    formData.append('premios', premios);
    formData.append('costoInscripcion', costoInscripcion);
    formData.append('maxEquipos', maxEquipos);
    formData.append('estado', estado);
    formData.append('imagenTorneo', imagenTorneo);
    formData.append('idOrganizador', userId);

    try {
      await api.post('/api/torneos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('✅ Torneo creado con éxito');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error(err.message);
      setMensaje('❌ Error al crear el torneo');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-5"
    >
      <BackArrow onClick={() => navigate(-1)} />
      <h2 className="text-2xl font-semibold text-[#009b3a] text-center">
        Crear Torneo
      </h2>

      {mensaje && (
        <div className="text-center text-sm font-medium text-gray-700">
          {mensaje}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Torneo
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona la ubicación en el mapa
        </label>
        <MapaSelector setLatLon={setLatLon} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de Fases (máx 3)
        </label>
        <input
          type="number"
          min="1"
          max="3"
          value={numeroFases}
          onChange={(e) => setNumeroFases(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Premios
        </label>
        <textarea
          value={premios}
          onChange={(e) => setPremios(e.target.value)}
          rows={2}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Costo de Inscripción
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={costoInscripcion}
          onChange={(e) => setCostoInscripcion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Máximo de Equipos
        </label>
        <input
          type="number"
          min="1"
          value={maxEquipos}
          onChange={(e) => setMaxEquipos(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#009b3a]"
        >
          {estados.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagen del Torneo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagenTorneo(e.target.files[0])}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#009b3a] text-white font-semibold py-2 rounded hover:bg-[#007d2f] transition-colors"
      >
        Crear Torneo
      </button>
    </form>
  );
}

export default FormularioTorneo;
