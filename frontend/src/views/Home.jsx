import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/LogoSportMingle';
import SectionBar from '../components/SectionBar';
import CategoryButton from '../components/CategoryButton';
import CreateButton from '../components/CreateButton';
import ContentContainer from '../components/ContentContainer';
import BotonMiClub from '../components/BotonMiClub';
import UserMenuDropdown from '../components/UserMenuDropdown';

const categorias = [
  { id: 'partidos', texto: 'Partidos', emoji: '⚽' },
  { id: 'torneos', texto: 'Torneos', emoji: '🏆' },
  { id: 'clubes', texto: 'Clubes', emoji: '🛡️' }
];

function Home() {
  const navigate = useNavigate();
  const [deporteSeleccionado, setDeporteSeleccionado] = useState('Fútbol');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('partidos');

  const handleDeporteChange = (deporte) => {
    setDeporteSeleccionado(deporte);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / BottomBar */}
      <div className="fixed bottom-0 left-0 w-full md:top-0 md:left-0 md:h-full md:w-80 md:border-r bg-white shadow-md z-20 flex flex-col">
        {/* Logo in Sidebar for Desktop */}
        <div className="hidden md:flex justify-center items-center py-6 border-b border-gray-100 mb-2">
          <Logo />
        </div>
        <SectionBar onChange={handleDeporteChange} className="h-full w-full" />
      </div>
      <div className="flex-1 md:ml-80 pb-24 md:pb-0">
        <header className="flex justify-between items-center py-4 border-b border-gray-300 px-4 sm:px-12 bg-white sticky top-0 z-10">
          <div className="md:hidden">
            <Logo />
          </div>

          {/* Categories in Header for Desktop (and Mobile if suitable, or keep in main for mobile? User said "in the header") */}
          {/* Let's put them in the center of the header for all views or just desktop? 
              User request: "queden en el header ... con el mismo nombre ... con un emoji"
              I will place them in the center of the header.
          */}
          <div className="hidden md:flex flex-1 justify-center gap-4 overflow-x-auto no-scrollbar mx-4">
            {categorias.map((cat) => (
              <CategoryButton
                key={cat.id}
                texto={`${cat.emoji} ${cat.texto}`}
                activo={cat.id === categoriaSeleccionada}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className="text-base px-6 py-2"
              />
            ))}
          </div>

          <div className="flex items-center">
            <UserMenuDropdown />
          </div>
        </header>

        <main className="mt-6 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 max-w-screen-xl mx-auto">
          {/* Botones de categoría removidos de aquí */}
          {/* Mobile Category Buttons (outside header, smaller) */}
          <div className="md:hidden flex flex-wrap justify-center gap-2 mb-6">
            {categorias.map((cat) => (
              <CategoryButton
                key={cat.id}
                texto={`${cat.emoji} ${cat.texto}`}
                activo={cat.id === categoriaSeleccionada}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className="text-sm px-4 py-1.5"
              />
            ))}
          </div>

          <BotonMiClub visible={categoriaSeleccionada === 'clubes'} />

          <ContentContainer
            categoria={categoriaSeleccionada}
            deporte={deporteSeleccionado}
          />

          <div className="mt-8 md:mt-26 flex justify-center">
            <CreateButton categoria={categoriaSeleccionada} />
          </div>
        </main>

      </div>
    </div>
  );
}

export default Home;
