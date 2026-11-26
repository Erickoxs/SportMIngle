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
    // Si el estado es finalizado o cancelado, ya caducó
    if (item.estado === 'finalizado' || item.estado === 'cancelado') {
      return false;
    }

    // Si el torneo está en inscripciones o en progreso, está activo y vigente
    if (item.estado === 'en_progreso' || item.estado === 'inscripciones') {
      if (item.fechaFin) {
        const fin = new Date(item.fechaFin);
        fin.setHours(23, 59, 59, 999);
        return fin >= ahora;
      }
      return true;
    }

    // Por defecto, si tiene fechaFin comprobar que no haya pasado
    if (item.fechaFin) {
      const fin = new Date(item.fechaFin);
      fin.setHours(23, 59, 59, 999);
      return fin >= ahora;
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
