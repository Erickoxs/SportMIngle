import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // URL de tu backend
  withCredentials: true // Si vas a manejar cookies o JWT
});

export default api;
