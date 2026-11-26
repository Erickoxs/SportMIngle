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
import VistaMisPartidos from "./views/VistaMisPartidos";
import VistaBracketTorneo from "./views/VistaBracketTorneo";
import UnirseAlClub from "./components/UnirseAlClub";
import PrivateRoute from "./components/PrivateRoute";
import OAuth2Redirect from "./views/OAuth2Redirect";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Protegidas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
              </PrivateRoute>
            
          }
        />
        <Route
          path="/mis-partidos"
          element={
            <PrivateRoute>
              <VistaMisPartidos />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear/partidos"
          element={
            <PrivateRoute>
              <FormularioPartido />
            </PrivateRoute>
          }
        />
        <Route
  path="/unirse/club/:idClub"
  element={
    <PrivateRoute>
      <UnirseAlClub />
    </PrivateRoute>
  }
/>
        <Route
          path="/crear/torneos"
          element={
            <PrivateRoute>
              <FormularioTorneo />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear/clubes"
          element={
            <PrivateRoute>
              <FormularioClub />
            </PrivateRoute>
          }
        />
        <Route
          path="/details/:categoria/:id"
          element={
            <PrivateRoute>
              <Details />
            </PrivateRoute>
          }
        />
        <Route
          path="/torneo/:idTorneo/bracket"
          element={
            <PrivateRoute>
              <VistaBracketTorneo />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:idSala"
          element={
            <PrivateRoute>
              <SalaChat />
            </PrivateRoute>
          }
        />
        <Route
          path="/mi-club/:idClub"
          element={
            <PrivateRoute>
              <VistaMiClub />
            </PrivateRoute>
          }
        />
        <Route
          path="/solicitudes/:idClub"
          element={
            <PrivateRoute>
              <VistaSolicitudes />
            </PrivateRoute>
          }
        />
        <Route
          path="/invitar-jugador/:idClub"
          element={
            <PrivateRoute>
              <VistaInvitarJugador />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
