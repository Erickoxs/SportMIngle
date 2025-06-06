import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/Register";
import Login from "./views/Login";


const App = () => {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
       
      </Routes>
    </Router>
  );
};

export default App;
