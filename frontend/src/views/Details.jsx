import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Componentes
import ImagenContainer from '../components/ImagenContainer';
import BackArrow from '../components/BackArrow';
import InfoSection from '../components/InfoSection';
import MapContainer from '../components/MapContainer';
import LogoSportMingle from '../components/LogoSportMingle';
import BotonInscribirse from '../components/BotonInscribirse';
import ListaInscripciones from '../components/InscriptionList';
import ChatButton from '../components/ChatButton';


// Axios personalizado
import api from '../utils/api';

function Details() {
  const { categoria, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await api.get(`/api/${categoria}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setItem(res.data);
      } catch (err) {
        setError('No se pudo cargar el contenido.');
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalle();
  }, [categoria, id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>No se encontró el contenido.</p>;

return (
  <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 py-6 max-w-screen-lg mx-auto space-y-8">
    <div className="flex justify-center">
      <LogoSportMingle />
    </div>
    
    <div className="mt-2">
      <BackArrow />
    </div>

    <ImagenContainer categoria={categoria} item={item} />
    <InfoSection item={item} />

    <ChatButton
      tipoSala={categoria}
      idReferencia={item.id || item.idPartido || item.idClub || item.idTorneo}
    />

    <MapContainer lat={item.lat} lon={item.lon} nombre={item.nombre} />

    <div className="flex justify-center">
      <BotonInscribirse
        categoria={categoria}
        idItem={item.id || item.idPartido || item.idClub || item.idTorneo}
        deporteTorneo={item.deporte}
      />
    </div>

    <ListaInscripciones categoria={categoria} id={id} />
  </div>
);
}

export default Details;
