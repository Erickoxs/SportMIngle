import axios from 'axios';

export async function obtenerContenidoPorCategoriaYDeporte(categoria, deporte, lat, lon) {
  const token = localStorage.getItem('token');

  const baseURL = import.meta.env.VITE_API_URL; // Usa variable de entorno
  const url = `${baseURL}/api/${categoria}/cercanos`;

  try {
    const response = await axios({
      method: 'get',
      url: url,
      params: {
        lat,
        lon,
        deporte,
        distancia: 20000
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;

  } catch (error) {
    console.error('Error al obtener el contenido:', error.message);
    return [];
  }
}
