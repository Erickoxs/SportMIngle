import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Login from "./views/Login";
import Home from "./views/Home";
import FormularioPartido from "./views/FormularioPartido";
import FormularioTorneo from "./views/FormularioTorneo";
import FormularioClub from "./views/FormularioClub";
import Details from "./views/Details";
import SalaChat from "./views/SalaChat";
import VistaMiClub from "./views/VistaMiClub";
import VistaInvitarJugador from "./views/VistaInvitarJugador";
import VistaSolicitudes from "./views/VistasSolicitudes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crear/partidos-informales" element={<FormularioPartido />} />
        <Route path="/crear/torneos" element={<FormularioTorneo />} />
        <Route path="/crear/clubes" element={<FormularioClub />} />
        <Route path="/details/:categoria/:id" element={<Details />} />
        <Route path="chat/:idSala" element={<SalaChat/>}/>
        <Route path="/mi-club/:id" element={<VistaMiClub/>}/>
         <Route path="/solicitudes" element={<VistaSolicitudes />} />
        <Route path="/invitar-jugador" element={<VistaInvitarJugador />} />
      </Routes>
    </Router>
  );
};

export default App;
