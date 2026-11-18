import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Protege la pantalla de administración: exige sesión y rol administrador
function RutaAdmin({ children }) {
    const { usuario, esAdmin } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!esAdmin) {
        return (
            <section className="seccion seccion--centrada">
                <h1>Acceso restringido</h1>
                <p>Esta sección es solo para administradores de la galería.</p>
            </section>
        );
    }

    return children;
}

export default RutaAdmin;
