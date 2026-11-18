import { useState } from "react";
import { useCarrito } from "./CartContext.jsx";
import { useNotificaciones } from "./Notifications.jsx";
import { TALLES, COLORES } from "../utils/opciones.js";

function AddToCartForm({ producto, onAgregado }) {
    const [talle, setTalle] = useState(TALLES[0]);
    const [color, setColor] = useState(COLORES[0]);
    const [cantidad, setCantidad] = useState(1);
    const carrito = useCarrito();
    const notificaciones = useNotificaciones();

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        const cantidadNumerica = Math.max(1, Math.trunc(Number(cantidad) || 1));
        carrito.agregar(producto, talle, color, cantidadNumerica);
        notificaciones.exito(`"${producto.nombre}" agregado al carrito.`);
        onAgregado?.();
    };

    return (
        <form className="agregar" onSubmit={manejarEnvio}>
            <div className="agregar__opciones">
                <div className="formulario__campo">
                    <label htmlFor="talle">Talle</label>
                    <select id="talle" value={talle} onChange={(evento) => setTalle(evento.target.value)}>
                        {TALLES.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="formulario__campo">
                    <label htmlFor="color">Color</label>
                    <select id="color" value={color} onChange={(evento) => setColor(evento.target.value)}>
                        {COLORES.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="formulario__campo">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input
                        id="cantidad"
                        type="number"
                        min="1"
                        step="1"
                        value={cantidad}
                        onChange={(evento) => setCantidad(evento.target.value)}
                    />
                </div>
            </div>
            <button type="submit" className="boton boton--principal">
                Agregar al carrito
            </button>
        </form>
    );
}

export default AddToCartForm;
