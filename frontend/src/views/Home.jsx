import React, { useState } from 'react';
import Logo from '../components/LogoSportMingle';
import SectionBar from '../components/SectionBar';
import CategoryButton from '../components/CategoryButton'; // importa el botón

const categorias = ['Partidos', 'Torneos', 'Clubes'];

function Home() {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('Fútbol');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Partidos');

  const handleDeporteChange = (deporte) => {
    setDeporteSeleccionado(deporte);
    // lógica para cargar contenido del deporte
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="flex flex-col items-center py-4 border-b border-gray-300 gap-4">
        <Logo />

        {/* Botones de categorías centrados y más pequeños */}
        
      </header>

      <main className="mt-6 px-6"><div className="flex justify-center items-center gap-6">
          {categorias.map((cat) => (
            <CategoryButton
              key={cat}
              texto={cat}
              activo={cat === categoriaSeleccionada}
              onClick={() => setCategoriaSeleccionada(cat)}
              size="sm" // si usás props opcionales en el componente
            />
          ))}
        </div>
        {/* Aquí puedes mostrar contenido según categoríaSeleccionada y deporteSeleccionado */}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md">
        <SectionBar onChange={handleDeporteChange} />
      </footer>
    </div>
  );
}

export default Home;
