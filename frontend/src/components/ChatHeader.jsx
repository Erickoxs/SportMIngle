import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ nombreSala }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 shadow" style={{ backgroundColor: '#009b3a', color: 'white' }}>
      <button onClick={() => navigate(-1)} className="text-sm font-semibold">
        ← Volver
      </button>
      <h2 className="text-lg font-bold text-center flex-1">{nombreSala}</h2>
      <div className="w-12" />
    </div>
  );
};

export default ChatHeader;
