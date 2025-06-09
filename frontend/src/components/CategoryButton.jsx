import React from 'react';

function CategoryButton({ texto, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1 rounded border transition font-medium
        ${activo 
          ? 'bg-[#009b3a] text-white border-[#009b3a]'
          : 'bg-white text-black border-[#009b3a] hover:bg-[#009b3a] hover:text-white'}
      `}
    >
      {texto}
    </button>
  );
}

export default CategoryButton;
