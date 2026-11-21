import React, { useState } from 'react';
import SportsButton from './SportsButton';

const deportes = [
  { nombre: 'Fútbol', icono: '/futbol.png' },
  { nombre: 'Baloncesto', icono: '/baloncesto.png' },
  { nombre: 'Tenis', icono: '/tenis.png' },
  { nombre: 'Voleibol', icono: '/voleibol.png' },
  { nombre: 'Béisbol', icono: '/beisbol.png' },
  { nombre: 'Natación', icono: '/natacion.png' },
];

function SectionBar({ onChange, className }) {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(deportes[0].nombre);

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
    </div>
  );
}

export default SectionBar;
