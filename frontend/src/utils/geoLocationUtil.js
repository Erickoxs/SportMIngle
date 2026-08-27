// utils/geolocationUtils.js
import api from './api';

// Cache en memoria para evitar llamadas repetidas a las mismas coordenadas
const cacheDirecciones = new Map();

export async function obtenerDireccion(lat, lon) {
  if (!lat || !lon) return 'Dirección no disponible';

  const cacheKey = `${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;
  if (cacheDirecciones.has(cacheKey)) {
    return cacheDirecciones.get(cacheKey);
  }

  try {
    // Consultar a nuestro propio backend (Spring Boot proxy) que a su vez consulta Nominatim con User-Agent válido
    const res = await api.get(`/api/geocoding/reverse?lat=${lat}&lon=${lon}`);
    const data = res.data;

    if (data) {
      // 1. Formato OpenStreetMap / Nominatim (Dirección exacta con calle, número, barrio)
      if (data.address) {
        const address = data.address;
        const parts = [];

        // Lugar de interés (cancha, centro deportivo, parque) y/o Calle con Número
        const place = address.amenity || address.building || address.shop || address.leisure || address.tourism || address.office || '';
        const road = address.road || address.pedestrian || address.highway || '';
        const houseNumber = address.house_number || '';

        let street = road;
        if (road && houseNumber) {
          street = `${road} #${houseNumber}`;
        }

        let via = '';
        if (place && street) {
          via = `${place} (${street})`;
        } else {
          via = place || street;
        }
        if (via) parts.push(via);

        // Barrio / Suburbio
        const barrio = address.neighbourhood || address.suburb || address.quarter || address.hamlet || '';
        if (barrio) parts.push(barrio);

        // Ciudad / Municipio
        const ciudad = address.city || address.town || address.village || address.municipality || '';
        if (ciudad) parts.push(ciudad);

        let direccionExacta = parts.join(', ');

        if (!direccionExacta && data.display_name) {
          const allParts = data.display_name.split(',').map(p => p.trim());
          direccionExacta = allParts.slice(0, Math.max(1, allParts.length - 2)).join(', ');
        }

        if (direccionExacta) {
          cacheDirecciones.set(cacheKey, direccionExacta);
          return direccionExacta;
        }
      }

      // 2. Formato BigDataCloud (Respaldo en caso de que Nominatim sea limitado)
      if (data.locality || data.city) {
        const parts = [];
        const barrio = data.locality || '';
        const ciudad = data.city || '';
        const depto = data.principalSubdivision || '';

        if (barrio) parts.push(barrio);
        if (ciudad && ciudad !== barrio) parts.push(ciudad);
        if (depto && depto !== ciudad) parts.push(depto);

        const direccionRespaldo = parts.join(', ') || data.localityInfo?.informational?.[0]?.name;
        if (direccionRespaldo) {
          cacheDirecciones.set(cacheKey, direccionRespaldo);
          return direccionRespaldo;
        }
      }

      if (typeof data.display_name === 'string') {
        cacheDirecciones.set(cacheKey, data.display_name);
        return data.display_name;
      }
    }
  } catch (error) {
    console.warn('⚠️ No se pudo obtener la dirección desde el backend:', error.message);
  }

  return 'Dirección no disponible';
}



