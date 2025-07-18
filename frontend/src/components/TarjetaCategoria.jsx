import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importa imágenes aleatorias para partidos informales
import img1 from '../assets/informal1.jfif';
import img2 from '../assets/informal2.jpg';
import img3 from '../assets/informal3.jpg';
import img4 from '../assets/informal4.jfif';
import img5 from '../assets/informal5.jpg';

const imagenesInformales = [img1, img2, img3, img4, img5];

function TarjetaCategoria({ categoria, item }) {
  const navigate = useNavigate();
  const imagenAleatoria = imagenesInformales[Math.floor(Math.random() * imagenesInformales.length)];

  const handleClick = () => {
    navigate(`/details/${categoria}/${item.id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden p-4 space-y-2 cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
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
          {console.log('🔗 URL imagen torneo:', item.imagenTorneo)}

          <img
  src={
    item.imagenTorneo
      ? `${import.meta.env.VITE_API_URL}/${item.imagenTorneo.replace(/\\/g, '/')}`
      : '/placeholder-torneo.jpg'
  }
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
          {console.log('🔗 URL logo club:', item.logoUrl)}

         <img
  src={
    item.logoUrl
      ? `${import.meta.env.VITE_API_URL}/${item.logoUrl.replace(/\\/g, '/')}`
      : '/placeholder-club.jpg'
  }
  alt="Logo del Club"
  className="w-full h-48 object-contain bg-gray-100 rounded"
/>
          <h3 className="text-lg font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-600">Dirección: {item.direccion}</p>
        </>
      )}
    </div>
  );
}

export default TarjetaCategoria;
