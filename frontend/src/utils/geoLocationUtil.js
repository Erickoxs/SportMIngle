// utils/geolocationUtils.js
export async function obtenerDireccion(lat, lon) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'SportMingle/1.0 (tu-email@example.com)',
      }
    });

    if (!response.ok) throw new Error('Error al obtener la dirección');

    const data = await response.json();
    const address = data.address || {};
    const parts = [];

    // 1. Nombre del sitio / calle y número
    const place = address.amenity || address.building || address.shop || address.office || address.tourism || address.industrial || address.highway || '';
    const houseNumber = address.house_number || '';
    const road = address.road || '';

    let street = road;
    if (houseNumber) {
      street = `${road} ${houseNumber}`;
    }
    if (place) {
      street = place + (street ? `, ${street}` : '');
    }
    if (street) parts.push(street);

    // 2. Barrio / Comuna / Suburbio
    const neighborhood = address.neighbourhood || address.suburb || address.quarter || address.hamlet || '';
    if (neighborhood) parts.push(neighborhood);

    // 3. Municipio / Ciudad / Pueblo
    const city = address.city || address.town || address.village || address.municipality || address.county || '';
    if (city) parts.push(city);

    // Unir las partes con coma. Si no hay nada, usar display_name recortado
    let shortAddress = parts.join(', ');

    if (!shortAddress && data.display_name) {
      const allParts = data.display_name.split(',').map(p => p.trim());
      if (allParts.length > 3) {
        // Omitir las últimas 3 partes (habitualmente departamento, código postal, país)
        shortAddress = allParts.slice(0, -3).join(', ');
      } else {
        shortAddress = data.display_name;
      }
    }

    return shortAddress || 'Dirección no disponible';
  } catch (error) {
    console.error('No se pudo obtener la dirección:', error.message);
    return 'Dirección no disponible';
  }
}

