import React from 'react';
import { formatearFechaHora, formatearFecha } from '../utils/format';

function InfoSection({ item }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2">
      {item.nombre && (
        <p>
          <span className="font-semibold text-gray-800">Nombre:</span>{' '}
          {item.nombre}
        </p>
      )}

      {item.nivelRequerido && (
        <p>
          <span className="font-semibold text-gray-800">Nivel requerido:</span>{' '}
          {item.nivelRequerido}
        </p>
      )}

      {item.fechaHora && (
        <p>
          <span className="font-semibold text-gray-800">Hora:</span>{' '}
          {formatearFechaHora(item.fechaHora)}
        </p>
      )}

      {item.fechaInicio && (
        <p>
          <span className="font-semibold text-gray-800">Fecha de inicio:</span>{' '}
          {formatearFecha(item.fechaInicio)}
        </p>
      )}

      {item.fechaFin && (
        <p>
          <span className="font-semibold text-gray-800">Fecha de fin:</span>{' '}
          {formatearFecha(item.fechaFin)}
        </p>
      )}

      {item.fechaFundacion && (
        <p>
          <span className="font-semibold text-gray-800">Fecha de fundación:</span>{' '}
          {formatearFecha(item.fechaFundacion)}
        </p>
      )}

      {item.direccion && (
        <p>
          <span className="font-semibold text-gray-800">Dirección:</span>{' '}
          {item.direccion}
        </p>
      )}

      {item.descripcion && (
        <p>
          <span className="font-semibold text-gray-800">Descripción:</span>{' '}
          {item.descripcion}
        </p>
      )}

      {item.costoInscripcion && (
        <p>
          <span className="font-semibold text-gray-800">Costo inscripción:</span>{' '}
          ${item.costoInscripcion}
        </p>
      )}
    </div>
  );
}

export default InfoSection;
