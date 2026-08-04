import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import SportsButton from './SportsButton';

const deportes = [
  { nombre: 'Fútbol', icono: '/futbol.png' },
  { nombre: 'Baloncesto', icono: '/baloncesto.png' },
  { nombre: 'Tenis', icono: '/tenis.png' },
  { nombre: 'Voleibol', icono: '/voleibol.png' },
  { nombre: 'Béisbol', icono: '/beisbol.png' },
  { nombre: 'Natación', icono: '/natacion.png' },
  // más deportes si quieres
];

function SectionBar({ onChange, className }) {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(deportes[0].nombre);
  const [usuario, setUsuario] = useState({ nombre: 'Usuario', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const email = decoded.sub || '';
        const nombre = decoded.nombre || 'Usuario';
        setUsuario({ nombre, email });
      } catch (err) {
        console.error('Error decodificando token en SectionBar:', err);
      }
    }
  }, []);

  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte);
    if (onChange) onChange(deporte);
  };

  return (
    <div className={`flex flex-row md:flex-col justify-between h-full bg-white ${className || ''}`}>
      {/* Contenedor de Deportes */}
      <section
        className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-4 bg-white p-2 md:pl-12 overflow-x-auto md:overflow-y-auto whitespace-nowrap md:whitespace-normal flex-1"
        style={{ WebkitOverflowScrolling: 'touch' }} // para scroll suave en iOS
      >
        {deportes.map(({ nombre, icono }) => (
          <SportsButton
            key={nombre}
            nombre={nombre}
            icono={icono}
            activo={nombre === deporteSeleccionado}
            onClick={() => seleccionarDeporte(nombre)}
          />
        ))}
      </section>

      {/* Sección de Perfil */}
      <div className="hidden md:flex items-center p-4 border-t border-gray-100 bg-white md:pl-12 w-full">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(usuario.email || 'default')}`}
          alt="Avatar"
          className="w-10 h-10 rounded-full bg-green-100 border border-green-200 mr-3 shrink-0"
        />
        <div className="flex flex-col overflow-hidden text-left">
          <span className="text-sm font-semibold text-gray-800 truncate" title={usuario.nombre}>
            {usuario.nombre}
          </span>
          <span className="text-xs text-gray-500 truncate" title={usuario.email}>
            {usuario.email}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SectionBar;
