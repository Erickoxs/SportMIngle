import React from 'react';

// Imágenes aleatorias para partidos informales
import img1 from '../assets/informal1.jfif';
import img2 from '../assets/informal2.jpg';
import img3 from '../assets/informal3.jpg';
import img4 from '../assets/informal4.jfif';
import img5 from '../assets/informal5.jpg';

const imagenesInformales = [img1, img2, img3, img4, img5];

function ImagenContainer({ categoria, item }) {
  let imageUrl = '';
  let altText = item.nombre || 'Imagen';

  if (categoria === 'partidos') {
    imageUrl = imagenesInformales[Math.floor(Math.random() * imagenesInformales.length)];
  }

  if (categoria === 'torneos') {
    imageUrl = item.imagenTorneo
      ? `${item.imagenTorneo.replace(/\\/g, '/')}`
      : '/placeholder-torneo.jpg';
  }

  if (categoria === 'clubes') {
    imageUrl = item.logoUrl
      ? `${item.logoUrl.replace(/\\/g, '/')}`
      : '/placeholder-club.jpg';
  }

  const categoryLabel = {
    partidos: '⚽ Partido Informal',
    torneos: '🏆 Torneo Oficial',
    clubes: '🛡️ Club Deportivo'
  }[categoria] || categoria;

  return (
    <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-md bg-gray-900 group">
      <img
        src={imageUrl}
        alt={altText}
        className={`w-full h-full ${categoria === 'clubes' ? 'object-contain bg-gray-50' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
      />
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      {/* Badge de categoría */}
      <div className="absolute top-4 left-4">
        <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
          {categoryLabel}
        </span>
      </div>

      {/* Nombre sobre la imagen si está disponible */}
      {item.nombre && (
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow-md">
            {item.nombre}
          </h1>
        </div>
      )}
    </div>
  );
}

export default ImagenContainer;
