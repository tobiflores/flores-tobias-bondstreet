import { createContext, useCallback, useContext, useRef, useState } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notificaciones, setNotificaciones] = useState([]);
    const siguienteId = useRef(1);

    const quitar = useCallback((id) => {
        setNotificaciones((previas) => previas.filter((n) => n.id !== id));
    }, []);

    const notificar = useCallback(
        (tipo, mensaje) => {
            const id = siguienteId.current++;
            setNotificaciones((previas) => [...previas, { id, tipo, mensaje }]);
            setTimeout(() => quitar(id), 4500);
        },
        [quitar]
    );

    const valor = {
        exito: (mensaje) => notificar("exito", mensaje),
        error: (mensaje) => notificar("error", mensaje)
    };

    return (
        <NotificationContext.Provider value={valor}>
            {children}
            <div className="notificaciones" role="status" aria-live="polite">
                {notificaciones.map((n) => (
                    <div key={n.id} className={`notificacion notificacion--${n.tipo}`}>
                        <p>{n.mensaje}</p>
                        <button
                            type="button"
                            className="notificacion__cerrar"
                            aria-label="Cerrar notificación"
                            onClick={() => quitar(n.id)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotificaciones() {
    const contexto = useContext(NotificationContext);
    if (!contexto) {
        throw new Error("useNotificaciones debe usarse dentro de NotificationProvider.");
    }
    return contexto;
}
