import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { useCarrito } from "./CartContext.jsx";
import { useNotificaciones } from "./Notifications.jsx";
import logo from "../assets/logo.svg";

function Header() {
    const { usuario, esAdmin, cerrarSesion } = useAuth();
    const { cantidadTotal } = useCarrito();
    const notificaciones = useNotificaciones();
    const navigate = useNavigate();

    const manejarSalir = () => {
        cerrarSesion();
        notificaciones.exito("Cerraste sesión. ¡Volvé pronto!");
        navigate("/");
    };

    return (
        <header className="header">
            <NavLink to="/" className="header__marca">
                <img src={logo} alt="Logo de Galería Bond Street" className="header__logo" />
                <span className="header__titulo">Bond Street</span>
            </NavLink>
            <nav className="header__nav" aria-label="Navegación principal">
                <ul className="header__menu">
                    <li>
                        <NavLink to="/" className="header__link" end>
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/catalogo" className="header__link">
                            Catálogo
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/carrito" className="header__link">
                            Carrito
                            {cantidadTotal > 0 && (
                                <span className="header__badge" aria-label={`${cantidadTotal} productos en el carrito`}>
                                    {cantidadTotal}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    {usuario && (
                        <li>
                            <NavLink to="/mis-pedidos" className="header__link">
                                Mis pedidos
                            </NavLink>
                        </li>
                    )}
                    {esAdmin && (
                        <li>
                            <NavLink to="/admin" className="header__link">
                                Administración
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="header__sesion">
                {usuario ? (
                    <>
                        <span className="header__usuario">Hola, {usuario.nombre}</span>
                        <button type="button" className="boton boton--secundario boton--chico" onClick={manejarSalir}>
                            Salir
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className="header__link">
                            Ingresar
                        </NavLink>
                        <NavLink to="/registro" className="boton boton--principal boton--chico">
                            Crear cuenta
                        </NavLink>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
