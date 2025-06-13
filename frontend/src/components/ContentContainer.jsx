import React, { useEffect, useRef, useState } from 'react';
import { obtenerContenidoPorCategoriaYDeporte } from '../utils/contentFetch';

function ContentContainer({ deporte, categoria }) {
  const [ubicacion, setUbicacion] = useState(null);
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const ubicacionObj = { lat: latitude, lon: longitude };
        localStorage.setItem('lat', latitude);
        localStorage.setItem('lon', longitude);
        setUbicacion(ubicacionObj);
      },
      (err) => {
        console.error('No se pudo obtener la ubicación', err);
        setContenido([{ error: 'No se pudo acceder a tu ubicación.' }]);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const fetchContenido = async () => {
      if (!ubicacion) return;

      setLoading(true);
      const data = await obtenerContenidoPorCategoriaYDeporte(
        categoria,
        deporte,
        ubicacion.lat,
        ubicacion.lon
      );
      setContenido(Array.isArray(data) ? data : [data]);
      setLoading(false);
    };

    fetchContenido();
  }, [ubicacion, deporte, categoria]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contenido]);

  useEffect(() => {
  const fetchContenido = async () => {
    if (!ubicacion) return;

    setLoading(true);
    const data = await obtenerContenidoPorCategoriaYDeporte(
      categoria,
      deporte,
      ubicacion.lat,
      ubicacion.lon
    );

    const items = Array.isArray(data) ? data : [data];

    // Para cada item, obtener su dirección
    const itemsConDireccion = await Promise.all(
      items.map(async (item) => {
        const direccion = await obtenerDireccion(item.lat, item.lon);
        return { ...item, direccion };
      })
    );

    setContenido(itemsConDireccion);
    setLoading(false);
  };

  fetchContenido();
}, [ubicacion, deporte, categoria]);

  if (loading) return <p className="text-center text-gray-500">Cargando contenido...</p>;

  return (
    <div ref={scrollRef} className="h-[400px] overflow-y-auto space-y-3 pr-2">
      {contenido.map((item, i) => (
  <div key={i} className="p-4 bg-white rounded shadow">
    <h2 className="font-bold text-lg">{item.nombre}</h2>
    <p className="text-sm text-gray-600 mb-1">{item.descripcion}</p>
    <p className="text-sm text-gray-500">📍 {item.direccion}</p>
    <p className="text-xs text-gray-400 italic">Deporte: {item.deporte}</p>
  </div>
))}
    </div>
  );
}

export default ContentContainer;
