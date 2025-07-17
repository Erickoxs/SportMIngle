import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/usuarios/login", {
        email,
        passwordHash,
      });

      console.log("Respuesta:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // Mostrar mensaje de error claro
      if (error.response?.data?.mensaje) {
        setErrorMensaje(error.response.data.mensaje);
      } else {
        setErrorMensaje("Error al iniciar sesión. Verifica tus datos.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 max-w-md w-full mx-auto"
    >
      <h2 className="text-center text-green-600 font-semibold text-2xl mb-4">
        Iniciar Sesión
      </h2>

      {errorMensaje && (
        <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded text-sm">
          {errorMensaje}
        </div>
      )}

      <input
        type="email"
        placeholder="Correo electrónico"
        className="p-3 rounded border border-gray-300 text-base"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="p-3 rounded border border-gray-300 text-base"
        value={passwordHash}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors"
      >
        Iniciar Sesión
      </button>

      <p className="text-center mt-4 text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-green-600 font-bold hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
