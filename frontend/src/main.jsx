import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import 'leaflet/dist/leaflet.css';
import App from './App.jsx'

// Definir global antes de renderizar React (¡fuera del JSX!)
window.global = window;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
