// utils/geolocationUtils.js
export async function obtenerDireccion(lat, lon) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'SportMingle/1.0 (tu-email@example.com)', // Reemplaza por tu email real si quieres cumplir con los términos
      }
    });

    if (!response.ok) throw new Error('Error al obtener la dirección');

    const data = await response.json();
    return data.display_name; // Aquí viene la dirección completa en texto
  } catch (error) {
    console.error('No se pudo obtener la dirección:', error);
    return 'Dirección no disponible';
  }
}
