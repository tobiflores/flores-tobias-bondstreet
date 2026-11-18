import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { validarLogin } from "../utils/validaciones.js";

function LoginPage() {
    const [valores, setValores] = useState({ email: "", password: "" });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const { iniciarSesion } = useAuth();
    const notificaciones = useNotificaciones();
    const navigate = useNavigate();

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setValores((previos) => ({ ...previos, [name]: value }));
    };

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        const nuevosErrores = validarLogin(valores);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        setEnviando(true);
        try {
            await iniciarSesion(valores);
            notificaciones.exito("¡Bienvenido de nuevo a la Bond!");
            navigate("/");
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="auth" aria-labelledby="titulo-login">
            <div className="auth__tarjeta">
                <h1 id="titulo-login" className="auth__titulo">
                    Iniciar sesión
                </h1>
                <form className="formulario" onSubmit={manejarEnvio} noValidate>
                    <div className="formulario__campo">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={valores.email}
                            onChange={manejarCambio}
                            aria-invalid={Boolean(errores.email)}
                            aria-describedby={errores.email ? "error-email" : undefined}
                        />
                        {errores.email && (
                            <p className="formulario__error" id="error-email" role="alert">
                                {errores.email}
                            </p>
                        )}
                    </div>
                    <div className="formulario__campo">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={valores.password}
                            onChange={manejarCambio}
                            aria-invalid={Boolean(errores.password)}
                            aria-describedby={errores.password ? "error-password" : undefined}
                        />
                        {errores.password && (
                            <p className="formulario__error" id="error-password" role="alert">
                                {errores.password}
                            </p>
                        )}
                    </div>
                    <button type="submit" className="boton boton--principal" disabled={enviando}>
                        {enviando ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
                <p className="auth__pie">
                    ¿No tenés cuenta? <Link to="/registro">Creá una acá</Link>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;
