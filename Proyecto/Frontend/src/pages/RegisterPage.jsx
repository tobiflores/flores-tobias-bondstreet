import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { validarRegistro } from "../utils/validaciones.js";

function RegisterPage() {
    const [valores, setValores] = useState({ nombre: "", email: "", password: "" });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const { registrarse } = useAuth();
    const notificaciones = useNotificaciones();
    const navigate = useNavigate();

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setValores((previos) => ({ ...previos, [name]: value }));
    };

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        const nuevosErrores = validarRegistro(valores);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        setEnviando(true);
        try {
            await registrarse(valores);
            notificaciones.exito("¡Cuenta creada! Ya sos parte de la Bond.");
            navigate("/");
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="auth" aria-labelledby="titulo-registro">
            <div className="auth__tarjeta">
                <h1 id="titulo-registro" className="auth__titulo">
                    Crear cuenta
                </h1>
                <form className="formulario" onSubmit={manejarEnvio} noValidate>
                    <div className="formulario__campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            autoComplete="name"
                            value={valores.nombre}
                            onChange={manejarCambio}
                            aria-invalid={Boolean(errores.nombre)}
                            aria-describedby={errores.nombre ? "error-nombre" : undefined}
                        />
                        {errores.nombre && (
                            <p className="formulario__error" id="error-nombre" role="alert">
                                {errores.nombre}
                            </p>
                        )}
                    </div>
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
                            autoComplete="new-password"
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
                        {enviando ? "Creando cuenta..." : "Registrarme"}
                    </button>
                </form>
                <p className="auth__pie">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </p>
            </div>
        </section>
    );
}

export default RegisterPage;
