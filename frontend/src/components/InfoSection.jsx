import React from 'react';

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
          {item.fechaHora}
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
