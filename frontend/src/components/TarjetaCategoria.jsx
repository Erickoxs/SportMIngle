import React from 'react';

// Importa imágenes aleatorias para partidos informales
import img1 from '../assets/informal1.jfif';
import img2 from '../assets/informal2.jpg';
import img3 from '../assets/informal3.jpg';
import img4 from '../assets/informal4.jfif';
import img5 from '../assets/informal5.jpg';

const imagenesInformales = [img1, img2, img3, img4, img5];

function TarjetaCategoria({ categoria, item }) {
  const imagenAleatoria = imagenesInformales[Math.floor(Math.random() * imagenesInformales.length)];

  // Depuración para torneos
  if (categoria === 'torneos') {
    console.log('🔍 Tarjeta de Torneo:', item);
  }

  // Depuración para clubes
  if (categoria === 'clubes') {
    console.log('🔍 Tarjeta de Club:', item);
  }

   if (categoria === 'partidos-informales') {
    console.log('🔍 Tarjeta de partido:', item);
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 space-y-2">
      {categoria === 'partidos-informales' && (
        <>
          <img
            src={imagenAleatoria}
            alt="Partido informal"
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-600">Nivel: {item.nivelRequerido}</p>
          <p className="text-sm text-gray-600">Hora: {item.fechaHora}</p>
        </>
      )}

      {categoria === 'torneos' && (
        <>
          <img
            src={item.imagenTorneo || '/placeholder-torneo.jpg'}
            alt="Torneo"
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-600">Costo de inscripción: ${item.costoInscripcion}</p>
          <p className="text-sm text-gray-600">Inicio: {item.fechaInicio}</p>
        </>
      )}

      {categoria === 'clubes' && (
        <>
          <img
            src={item.logoUrl || '/placeholder-club.jpg'}
            alt="Logo del Club"
            className="w-full h-48 object-contain bg-gray-100 rounded"
          />
          <h3 className="text-lg font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-600">Direccion: {item.direccion}</p>
        </>
      )}
    </div>
  );
}

export default TarjetaCategoria;
