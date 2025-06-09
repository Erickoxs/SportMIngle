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

function SectionBar({ onChange }) {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(deportes[0].nombre);

  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte);
    if (onChange) onChange(deporte);
  };

  return (
    <section
      className="flex space-x-3 bg-white p-2 shadow-md overflow-x-auto overflow-y-visible whitespace-nowrap"
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
