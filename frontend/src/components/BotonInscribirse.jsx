import React from 'react';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';
import { useParams } from 'react-router-dom';

const BotonInscribirse = ({ categoria, idItem, deporteTorneo }) => {
  const { id } = useParams();

  const handleInscribirse = async () => {
    const token = localStorage.getItem('token');
    

    if (!token) {
      alert('Debes estar logueado para inscribirte. No se encontró un token.');
      return;
    }

    const decoded = decodeToken(token);
    const idUsuario = decoded?.id;

    if (!idUsuario) {
      alert('Tu sesión no es válida o no contiene un ID de usuario.');
      return;
    }

    try {
      let ruta = '';
      let payload = {};

      switch (categoria) {
        case 'clubes':
          ruta = `/api/solicitudes/solicitar?idUsuario=${idUsuario}&idClub=${idItem}`;
          payload = null;
          break;

        case 'partidos':
          ruta = '/api/jugadores';
          payload = {
            jugador: { idUsuario: idUsuario }, // Mapeo explícito
            partidoInformal: { idPartido: idItem }
          };
          break;

        case 'torneos':
          const clubRes = await api.get(`/api/clubes/organizador/${idUsuario}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const club = clubRes.data;

          if (!club) {
            alert('No eres organizador de ningún club.');
            return;
          }

          if (club.deporte !== deporteTorneo) {
            alert(`El club debe ser del mismo deporte que el torneo (${deporteTorneo}).`);
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
          return;
      }

      const res = await api.post(ruta, payload, {
        headers: {
          'Authorization': `Bearer ${token}` // Aseguramos que la cabecera vaya limpia
        }
      });

      alert('Inscripción exitosa.');

    } catch (error) {
      console.error('❌ Error al inscribirse:', error.message);
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
