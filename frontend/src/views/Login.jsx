import Logo from "../components/LogoSportMingle";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div style={styles.container}>
      <Logo />
      <LoginForm />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",              // Ocupa todo el ancho
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",       // Centra horizontalmente
    justifyContent: "center",   // Centra verticalmente
    padding: "2rem",
    boxSizing: "border-box",    // Para que padding no aumente el tamaño total
  },
};

export default Login;
