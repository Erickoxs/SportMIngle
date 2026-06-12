import React from 'react';
import api from '../utils/api';
import { decodeToken } from '../utils/decodeJWT';
import { useParams } from 'react-router-dom';

const BotonInscribirse = ({ categoria, idItem, deporteTorneo }) => {
  const { id } = useParams();

  const handleInscribirse = async () => {
    const token = localStorage.getItem('token');
    console.log("🔍 [DEBUG FRONT] Token recuperado de localStorage:", token ? "Presente (comienza por ey...)" : "❌ AUSENTE");

    if (!token) {
      alert('Debes estar logueado para inscribirte. No se encontró un token.');
      return;
    }

    const decoded = decodeToken(token);
    console.log("🔍 [DEBUG FRONT] Token decodificado:", decoded);
    const idUsuario = decoded?.id;
    console.log("🔍 [DEBUG FRONT] ID de usuario extraído del JWT:", idUsuario);

    if (!idUsuario) {
      alert('Tu sesión no es válida o no contiene un ID de usuario.');
      return;
    }

    try {
      let ruta = '';
      let payload = {};

      console.log("🔍 [DEBUG FRONT] Ejecutando caso para categoría:", categoria);

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
          console.log("📡 [DEBUG FRONT] Buscando club para el organizador:", idUsuario);
          const clubRes = await api.get(`/api/clubes/organizador/${idUsuario}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const club = clubRes.data;
          console.log("🔍 [DEBUG FRONT] Club devuelto por el servidor:", club);

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

      console.log("📡 [DEBUG FRONT] Enviando petición POST...");
      console.log("-> URL de destino:", ruta);
      console.log("-> Payload final:", JSON.stringify(payload));

      const res = await api.post(ruta, payload, {
        headers: {
          'Authorization': `Bearer ${token}` // Aseguramos que la cabecera vaya limpia
        }
      });

      console.log('✅ Inscripción exitosa en el servidor:', res.data);
      alert('Inscripción exitosa.');

    } catch (error) {
      console.error('❌ Error capturado en el bloque catch de Axios:', error);

      if (error.response) {
        console.error('📡 Estado HTTP devuelto:', error.response.status);
        console.error('📨 Mensaje detallado del backend:', error.response.data);
      } else if (error.request) {
        console.warn('⏳ La petición se envió pero el servidor no respondió o la bloqueó (CORS/Redirect):', error.request);
      } else {
        console.warn('⚠️ Error de configuración de Axios:', error.message);
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
