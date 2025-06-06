import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/LogoSportMingle";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/")}
        className="self-start mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-base font-medium">Volver</span>
      </button>

      <Logo />
      <RegisterForm />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "2rem",
  },
};

export default Register;
