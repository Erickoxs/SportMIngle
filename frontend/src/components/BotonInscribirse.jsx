import React from 'react';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';
import { useParams } from 'react-router-dom';

const BotonInscribirse = ({ categoria, idItem, deporteTorneo }) => {
  const { id } = useParams();

  const handleInscribirse = async () => {
    const token = localStorage.getItem('token');
    const decoded = decodeToken(token);
    const idUsuario = decoded?.id;

   

    if (!token || !idUsuario) {
      alert('Debes estar logueado para inscribirte.');
      return;
    }

    try {
      let ruta = '';
      let payload = {};

      switch (categoria) {
   case 'clubes':
  ruta = `/api/solicitudes/solicitar?idUsuario=${idUsuario}&idClub=${idItem}`;
  payload = null; // no se envía body, solo los params
  break;
        case 'partidos-informales':
        
          ruta = '/api/jugadores';
          payload = {
            jugador: { idUsuario },
            partidoInformal: { idPartidoInformal: idItem }
          };
          break;

        case 'torneos':
          

          const clubRes = await api.get(`/api/clubes/organizador/${idUsuario}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const club = clubRes.data;


          if (!club) {
            alert('No eres organizador de ningún club.');
            console.warn('⚠️ No se encontró un club válido para el organizador');
            return;
          }

        
          if (club.deporte !== deporteTorneo) {
            alert(`El club debe ser del mismo deporte que el torneo (${deporteTorneo}).`);
            console.warn('❌ El deporte del club no coincide con el del torneo');
            return;
          }

          ruta = '/api/inscripciones';
          payload = {
            torneo: { id: idItem },
            clubes: { id: club.id },
            pagoRealizado: false
          };

          break;

        default:
          alert('Categoría no válida.');
          console.error('❌ Categoría no reconocida:', categoria);
          return;
      }

    

      const res = await api.post(ruta, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Inscripción exitosa:', res.data);
      alert('Inscripción exitosa.');
    } catch (error) {
      console.error('❌ Error al inscribirse:', error);

      if (error.response) {
        console.error('📡 Código de estado:', error.response.status);
        console.error('📨 Respuesta del servidor:', error.response.data);
        alert(`Error del servidor: ${error.response.data?.message || 'Intenta nuevamente.'}`);
      } else if (error.request) {
        console.warn('⏳ No hubo respuesta del servidor:', error.request);
        alert('No se recibió respuesta del servidor.');
      } else {
        console.warn('⚠️ Error al preparar la solicitud:', error.message);
        alert('Error inesperado al intentar inscribirse.');
      }
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleInscribirse}
        className="text-white px-6 py-2 rounded font-semibold transition"
        style={{
          backgroundColor: '#009b3a',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#007d2f')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#009b3a')}
      >
        Inscribirse
      </button>
    </div>
  );
};

export default BotonInscribirse;
