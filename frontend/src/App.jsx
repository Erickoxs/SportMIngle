import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Login from "./views/Login";
import Home from "./views/Home"
import FormularioPartido from "./views/FormularioPartido";
import FormularioTorneo from "./views/FormularioTorneo";
import FormularioClub from "./views/FormularioClub";


const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="crear/partidos-informales" element={<FormularioPartido/>}/>
        <Route path="crear/torneos" element={<FormularioTorneo/>}/>
        <Route path="crear/clubes" element={<FormularioClub/>}/>
       
      </Routes>
    </Router>
  );
};

export default App;
