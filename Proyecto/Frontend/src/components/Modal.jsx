import { useEffect, useRef } from "react";

function Modal({ titulo, onClose, children }) {
    const referencia = useRef(null);

    useEffect(() => {
        const manejarEscape = (evento) => {
            if (evento.key === "Escape") onClose();
        };
        document.addEventListener("keydown", manejarEscape);
        referencia.current?.focus();
        return () => document.removeEventListener("keydown", manejarEscape);
    }, [onClose]);

    return (
        <div className="modal__fondo" onClick={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label={titulo}
                tabIndex={-1}
                ref={referencia}
                onClick={(evento) => evento.stopPropagation()}
            >
                <div className="modal__encabezado">
                    <h2 className="modal__titulo">{titulo}</h2>
                    <button type="button" className="modal__cerrar" aria-label="Cerrar ventana" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal__contenido">{children}</div>
            </div>
        </div>
    );
}

export default Modal;
