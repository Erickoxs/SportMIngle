// src/views/VistaSolicitudes.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import BackArrow from '../components/BackArrow';
import ListaSolicitudesClub from '../components/ListaSolicitudesClub';

const VistaSolicitudes = () => {
  const { idClub } = useParams();

  return (
    <div className="p-4">
      <BackArrow />
      <h1 className="text-2xl font-bold mt-4 mb-4">Solicitudes Recibidas</h1>
      <ListaSolicitudesClub idClub={idClub} />
    </div>
  );
};

export default VistaSolicitudes;
