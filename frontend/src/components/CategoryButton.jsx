import React from 'react';

function CategoryButton({ texto, activo, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border transition font-medium ${className || ''}
        ${activo
          ? 'bg-[#009b3a] text-white border-[#009b3a] shadow-md'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#009b3a] hover:text-[#009b3a]'}
      `}
    >
      {texto}
    </button>
  );
}

export default CategoryButton;
