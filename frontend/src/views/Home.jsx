import React, { useState } from 'react';
import Logo from '../components/LogoSportMingle';
import SectionBar from '../components/SectionBar';
import CategoryButton from '../components/CategoryButton';
import CreateButton from '../components/CreateButton';
import ContentContainer from '../components/ContentContainer';
import BotonMiClub from '../components/BotonMiClub';
import LogoutButton from '../components/LogoutButton'; 

const categorias = ['partidos', 'torneos', 'clubes'];

function Home() {
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('Fútbol');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('partidos');

  const handleDeporteChange = (deporte) => {
    setDeporteSeleccionado(deporte);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="flex justify-between items-center py-4 border-b border-gray-300 px-4 sm:px-12">
  <Logo />
  <LogoutButton />
</header>

      <main className="mt-6 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 max-w-screen-xl mx-auto">
        {/* Botones de categoría */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
          {categorias.map((cat) => (
            <CategoryButton
              key={cat}
              texto={cat}
              activo={cat === categoriaSeleccionada}
              onClick={() => setCategoriaSeleccionada(cat)}
              size="sm"
            />
          ))}
        </div>

        <BotonMiClub visible={categoriaSeleccionada === 'clubes'} />

        <ContentContainer
          categoria={categoriaSeleccionada}
          deporte={deporteSeleccionado}
        />

        <div className="mt-8 flex justify-center">
          <CreateButton categoria={categoriaSeleccionada} />
        </div>
      </main>

      {/* Barra inferior */}
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md">
        <SectionBar onChange={handleDeporteChange} />
      </footer>
    </div>
  );
}

export default Home;
