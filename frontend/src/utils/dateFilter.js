// src/utils/dateFilter.js

/**
 * Valida si un partido, torneo o club no ha caducado
 */
export function esNoCaducado(item, categoria) {
  if (!item) return false;
  const ahora = new Date();

  if (categoria === 'partidos') {
    if (!item.fechaHora) return true;
    const fecha = new Date(item.fechaHora);
    return fecha >= ahora;
  }

  if (categoria === 'torneos') {
    if (item.estado === 'finalizado' || item.estado === 'cancelado') {
      return false;
    }
    if (item.fechaInicio) {
      const fecha = new Date(item.fechaInicio);
      // Mantener torneos vigentes durante todo el día de inicio
      fecha.setHours(23, 59, 59, 999);
      return fecha >= ahora;
    }
    return true;
  }

  // Los clubes no tienen caducidad
  return true;
}

/**
 * Calcula la distancia en línea recta entre dos puntos geográficos (Haversine)
 */
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}
