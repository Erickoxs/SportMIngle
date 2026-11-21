import React from 'react';
import { formatearFechaHora, formatearFecha } from '../utils/format';

function InfoSection({ item }) {
  const infoCards = [
    item.fechaHora && {
      icon: '⏰',
      label: 'Fecha y Hora',
      value: formatearFechaHora(item.fechaHora),
      destacado: true,
    },
    item.fechaInicio && {
      icon: '🗓️',
      label: 'Fecha de Inicio',
      value: formatearFecha(item.fechaInicio),
    },
    item.fechaFin && {
      icon: '🏁',
      label: 'Fecha de Fin',
      value: formatearFecha(item.fechaFin),
    },
    item.fechaFundacion && {
      icon: '🏛️',
      label: 'Fundación',
      value: formatearFecha(item.fechaFundacion),
    },
    item.nivelRequerido && {
      icon: '🎯',
      label: 'Nivel Requerido',
      value: item.nivelRequerido,
      badge: true,
    },
    item.costoInscripcion && {
      icon: '💵',
      label: 'Costo Inscripción',
      value: `$${item.costoInscripcion}`,
      destacado: true,
    },
    item.direccion && {
      icon: '📍',
      label: 'Dirección',
      value: item.direccion,
      fullWidth: true,
    },
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Título en caso de partidos o si no viene nombre en el hero */}
      {!item.nombre && item.deporte && (
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Partido de {item.deporte}
          </h1>
        </div>
      )}

      {/* Grid de Información (2 columnas en móvil, adaptable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {infoCards.map((info, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm flex items-start gap-3 transition hover:border-emerald-200 ${
              info.fullWidth ? 'sm:col-span-2' : ''
            }`}
          >
            <span className="text-2xl shrink-0 p-1 bg-emerald-50 rounded-lg">
              {info.icon}
            </span>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                {info.label}
              </span>
              {info.badge ? (
                <span className="inline-block mt-1 bg-emerald-100 text-[#009b3a] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {info.value}
                </span>
              ) : (
                <p className={`text-sm font-bold text-gray-800 truncate mt-0.5 ${info.destacado ? 'text-[#009b3a]' : ''}`}>
                  {info.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Descripción */}
      {item.descripcion && (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📝</span> Descripción
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {item.descripcion}
          </p>
        </div>
      )}
    </div>
  );
}

export default InfoSection;
