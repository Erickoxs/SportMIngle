import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
