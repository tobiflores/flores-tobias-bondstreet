import { createContext, useCallback, useContext, useState } from "react";
import * as authService from "../services/auth.service.js";

const AuthContext = createContext(null);
const CLAVE_SESION = "bond_sesion";

const leerSesion = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION)) ?? null;
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(leerSesion);

    const guardar = useCallback((nuevaSesion) => {
        setSesion(nuevaSesion);
        if (nuevaSesion) {
            localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
        } else {
            localStorage.removeItem(CLAVE_SESION);
        }
    }, []);

    const iniciarSesion = useCallback(
        async (credenciales) => {
            guardar(await authService.iniciarSesion(credenciales));
        },
        [guardar]
    );

    const registrarse = useCallback(
        async (datos) => {
            guardar(await authService.registrarse(datos));
        },
        [guardar]
    );

    const cerrarSesion = useCallback(() => {
        if (sesion?.token) {
            // aviso al backend sin bloquear la UI
            authService.cerrarSesion(sesion.token).catch(() => {});
        }
        guardar(null);
    }, [sesion, guardar]);

    const valor = {
        usuario: sesion?.usuario ?? null,
        token: sesion?.token ?? null,
        esAdmin: sesion?.usuario?.rol === "administrador",
        iniciarSesion,
        registrarse,
        cerrarSesion
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de AuthProvider.");
    }
    return contexto;
}
