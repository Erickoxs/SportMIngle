import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from 'react-router-dom';

const InvitarClub = ({ idClub: propIdClub }) => {
  const params = useParams();
  const idClub = propIdClub || params.idClub;
  const [copiado, setCopiado] = useState(false);

  const url = `${window.location.origin}/unirse/club/${idClub}`;

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback
      const input = document.getElementById('link-invitacion');
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }
    }
  };

  const compartirWhatsApp = () => {
    const texto = `¡Hola! Únete a nuestro club deportivo en SportMingle ingresando al siguiente enlace: ${url}`;
    const urlWa = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWa, '_blank');
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
      {/* Tarjeta Enlace de invitación */}
      <div className="w-full bg-slate-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔗</span>
          <h3 className="text-sm font-bold text-gray-800">Enlace de Invitación Directo</h3>
        </div>
        <p className="text-xs text-gray-500">
          Comparte este enlace para que cualquier deportista pueda solicitar unirse o ser miembro del club.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="link-invitacion"
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl font-mono text-gray-700 focus:outline-none select-all"
            onClick={(e) => e.target.select()}
          />
          <button
            onClick={copiarEnlace}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition active:scale-95 shrink-0 ${
              copiado
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {copiado ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Botón WhatsApp */}
        <button
          onClick={compartirWhatsApp}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition active:scale-98"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
          </svg>
          <span>Compartir en WhatsApp</span>
        </button>
      </div>

      {/* Tarjeta Código QR */}
      <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-xs">
        <h3 className="text-sm font-bold text-gray-800 mb-1">Código QR del Club</h3>
        <p className="text-xs text-gray-500 mb-4">
          Permite que los jugadores en cancha escaneen directamente con la cámara de su celular.
        </p>

        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200/70 inline-block">
          <QRCodeCanvas value={url} size={180} />
        </div>
      </div>
    </div>
  );
};

export default InvitarClub;
