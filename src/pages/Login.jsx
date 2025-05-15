import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // <- nuevo estado para errores

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  async function login(e) {
    e.preventDefault();

    const url = "https://fedegan-backend.onrender.com/login";

    const body = {
      correo: credentials.email,
      contraseña: credentials.password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseBody = await response.json();

      if (response.ok && responseBody.token) {
        localStorage.setItem("token", responseBody.token);
        setErrorMessage(""); // limpiamos errores si fue exitoso
        onLogin(); // continuar con la app
      } else {
        setErrorMessage(
          responseBody.mensaje || "Correo o contraseña incorrectos."
        );
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Inténtalo nuevamente.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">FEDEGÁN</h1>
          <p className="login-subtitle">
            Control Sanitario y Trazabilidad Ganadera
          </p>
        </div>

        <form className="login-form" onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="usuario@fedegan.org.co"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Recordarme</label>
            </div>
            <a href="#" className="forgot-password">
              ¿Olvidó su contraseña?
            </a>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>Sistema de Control Sanitario y Trazabilidad Ganadera</p>
          <p>&copy; 2025 FEDEGÁN - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
