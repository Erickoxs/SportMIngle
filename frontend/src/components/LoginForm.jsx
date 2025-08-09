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

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      if (error.response?.data?.mensaje) {
        setErrorMensaje(error.response.data.mensaje);
      } else {
        setErrorMensaje("Error al iniciar sesión. Verifica tus datos.");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Cambia la URL por la de tu backend local o de producción
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
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

      {/* Login con email */}
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

      {/* Separador */}
      <div className="flex items-center gap-4 my-4">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">o</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Botón Google */}
      <button
  type="button"
  onClick={handleGoogleLogin}
  className="flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:shadow-md transition-shadow"
>
  <img
    src="https://www.svgrepo.com/show/355037/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Iniciar sesión con Google
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
