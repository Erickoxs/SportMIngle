import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreateButton({ categoria }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!categoria) return;
    navigate(`/crear/${categoria}`);
  };

  return (
    <button
      onClick={handleClick}
      className="text-white px-4 py-2 rounded shadow"
      style={{
        backgroundColor: '#009b3a',
        transition: 'background-color 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#007d2f')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#009b3a')}
    >
      Crear {categoria?.replace('-', ' ') }
    </button>
  );
}

export default CreateButton;
