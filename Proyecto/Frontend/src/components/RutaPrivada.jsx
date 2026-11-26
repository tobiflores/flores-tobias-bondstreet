import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Exige sesión iniciada (cualquier rol)
function RutaPrivada({ children }) {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RutaPrivada;
