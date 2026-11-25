import React, { useEffect, useRef, useState } from 'react';
import { obtenerContenidoPorCategoriaYDeporte } from '../utils/contentFetch';
import { obtenerDireccion } from '../utils/geoLocationUtil';
import { esNoCaducado } from '../utils/dateFilter';
import TarjetaCategoria from './TarjetaCategoria';
import HomeMapView from './HomeMapView';

function ContentContainer({ deporte, categoria }) {
  const [ubicacion, setUbicacion] = useState(null);
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modoVista, setModoVista] = useState('lista'); // 'lista' | 'mapa'
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
        console.error('No se pudo obtener la ubicación', err.message);
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

      const items = Array.isArray(data) ? data : data ? [data] : [];

      // 🔥 Filtrar únicamente los que NO hayan caducado
      const itemsVigentes = items.filter((item) => esNoCaducado(item, categoria));

      const itemsConDireccion = await Promise.all(
        itemsVigentes.map(async (item) => {
          const direccion = await obtenerDireccion(item.lat, item.lon);
          return { ...item, direccion };
        })
      );

      setContenido(itemsConDireccion);
      setLoading(false);
    };

    fetchContenido();
  }, [ubicacion, deporte, categoria]);

  useEffect(() => {
    if (scrollRef.current && modoVista === 'lista') {
      scrollRef.current.scrollTop = 0;
    }
  }, [contenido, modoVista]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-gray-500 text-sm font-medium">Buscando {categoria} cercanos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de control: Contador de disponibles + Switch Lista / Mapa */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-600">
            {contenido.length}{' '}
            {contenido.length === 1 ? `${categoria.slice(0, -1)} activo` : `${categoria} activos`}
          </span>
        </div>

        {/* Toggle Segmentado Lista | Mapa */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200/70 shadow-2xs">
          <button
            onClick={() => setModoVista('lista')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modoVista === 'lista'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>📋</span>
            <span>Lista</span>
          </button>

          <button
            onClick={() => setModoVista('mapa')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              modoVista === 'mapa'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>🗺️</span>
            <span>Mapa</span>
          </button>
        </div>
      </div>

      {/* Contenido en Lista o en Mapa */}
      {contenido.length === 0 ? (
        <div className="text-center py-14 px-4 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs">
          <span className="text-4xl block mb-2">🏟️</span>
          <h3 className="text-base font-bold text-gray-800">
            No hay {categoria} disponibles próximos
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            No encontramos eventos vigentes de {deporte} cerca de tu posición. ¡Sé el primero en crear uno!
          </p>
        </div>
      ) : modoVista === 'lista' ? (
        <div ref={scrollRef} className="max-h-[600px] overflow-y-auto pr-1">
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
            {contenido.map((item, i) => (
              <TarjetaCategoria key={item.id || i} categoria={categoria} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <HomeMapView
          items={contenido}
          categoria={categoria}
          deporte={deporte}
          ubicacion={ubicacion}
        />
      )}

      {/* Botón flotante móvil estilo Airbnb */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 md:hidden">
        <button
          onClick={() => setModoVista((prev) => (prev === 'lista' ? 'mapa' : 'lista'))}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full shadow-lg text-xs font-bold active:scale-95 transition-all border border-gray-700"
        >
          {modoVista === 'lista' ? (
            <>
              <span>🗺️</span>
              <span>Ver en Mapa</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Ver en Lista</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ContentContainer;
