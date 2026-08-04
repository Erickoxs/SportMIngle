export const formatearFechaHora = (fechaString) => {
  if (!fechaString) return '';
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return fechaString;
  return fecha.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatearFecha = (fechaString) => {
  if (!fechaString) return '';
  // Si viene en formato YYYY-MM-DD sin T ni hora
  if (fechaString.includes('-') && !fechaString.includes('T')) {
    const parts = fechaString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return fechaString;
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
