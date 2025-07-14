import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'react-router-dom';

const InvitarClub = () => {
  const { idClub } = useParams();
  const url = `https://sportmingle.com/unirse/club/${idClub}`;

  return (
    <div className="pt-8 px-6 flex flex-col items-center justify-start min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-center">Invitar al Club</h1>

      <div className="mb-6 w-full max-w-md">
        <p className="mb-2 font-semibold text-center">Link de invitación:</p>
        <input
          type="text"
          value={url}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 text-center"
          onClick={(e) => e.target.select()}
        />
      </div>

      <div className="mb-6 flex flex-col items-center">
        <p className="mb-2 font-semibold text-center">Escanea el código QR:</p>
        <QRCodeCanvas value={url} size={180} />
      </div>
    </div>
  );
};

export default InvitarClub;
