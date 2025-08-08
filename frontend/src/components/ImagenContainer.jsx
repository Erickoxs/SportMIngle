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

  return (
    <div className="w-full h-64">
      <img
        src={imageUrl}
        alt={altText}
        className={`w-full h-full ${categoria === 'clubes' ? 'object-contain bg-gray-100' : 'object-cover'} rounded-lg`}
      />
    </div>
  );
}

export default ImagenContainer;
