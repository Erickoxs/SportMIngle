import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // importa tu instancia de axios

const RegisterForm = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    cedula: "",
    email: "",
    password: "",
    confirmarPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Aquí envías el formulario al backend
      const response = await api.post("/api/usuarios/register", {
        nombre: formData.nombre,
        fechaNacimiento: formData.fechaNacimiento,
        numeroCedula: formData.cedula,
        email: formData.email,
        passwordHash: formData.password, // o passwordHash si es lo que espera tu backend
      });

      console.log("Registro exitoso:", response.data);
      navigate("/");
      // Aquí podrías redirigir o limpiar el formulario
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error al registrar usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {/* Aquí van los inputs como antes */}
      {/* ... */}

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px"
        }}
      />
      <input
        type="date"
        name="fechaNacimiento"
        value={formData.fechaNacimiento}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px",
          color: formData.fechaNacimiento ? "#000" : "#757575"
        }}
      />
      <input
        type="text"
        name="cedula"
        placeholder="Número de CC"
        value={formData.cedula}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px"
        }}
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px"
        }}
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px"
        }}
      />
      <input
        type="password"
        name="confirmarPassword"
        placeholder="Confirmar contraseña"
        value={formData.confirmarPassword}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "16px"
        }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#009b3a",
          color: "white",
          padding: "12px",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px"
        }}
      >
        Registrarse
      </button>
    </form>
  );
};

export default RegisterForm;
