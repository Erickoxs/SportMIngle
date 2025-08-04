import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Asegúrate que la clave sea correcta
    window.location.reload(); // O redirige: window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="hover:opacity-80 transition"
      title="Cerrar sesión"
    >
      <img
        src="/logout.png"
        alt="Cerrar sesión"
        className="w-6 h-6 sm:w-8 sm:h-8"
      />
    </button>
  );
};

export default LogoutButton;
