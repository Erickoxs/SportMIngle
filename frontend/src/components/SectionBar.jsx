import React, { useState } from 'react';
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

  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte);
    if (onChange) onChange(deporte);
  };

  return (
    <section
      className={`flex md:flex-col space-x-3 md:space-x-0 md:space-y-4 bg-white p-2 md:pl-12 shadow-md overflow-x-auto md:overflow-y-auto whitespace-nowrap md:whitespace-normal ${className || ''}`}
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
  );
}

export default SectionBar;
