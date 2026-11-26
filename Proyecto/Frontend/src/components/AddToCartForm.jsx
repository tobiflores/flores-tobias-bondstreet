import { useEffect, useMemo, useState } from "react";
import { useCarrito } from "./CartContext.jsx";
import { useNotificaciones } from "./Notifications.jsx";
import { obtenerStock } from "../services/stock.service.js";
import Loader from "./Loader.jsx";

function AddToCartForm({ producto, onAgregado }) {
    const [variantes, setVariantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [talle, setTalle] = useState("");
    const [color, setColor] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const carrito = useCarrito();
    const notificaciones = useNotificaciones();

    useEffect(() => {
        const cargar = async () => {
            try {
                const stock = await obtenerStock(producto.id);
                const disponibles = stock.filter((variante) => variante.cantidad > 0);
                setVariantes(disponibles);
                if (disponibles.length > 0) {
                    setTalle(disponibles[0].talle);
                    setColor(disponibles[0].color);
                }
            } catch (error) {
                notificaciones.error(error.message);
            } finally {
                setCargando(false);
            }
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [producto.id]);

    const talles = useMemo(() => [...new Set(variantes.map((variante) => variante.talle))], [variantes]);

    const coloresDelTalle = useMemo(
        () => variantes.filter((variante) => variante.talle === talle).map((variante) => variante.color),
        [variantes, talle]
    );

    const varianteElegida = useMemo(
        () => variantes.find((variante) => variante.talle === talle && variante.color === color) ?? null,
        [variantes, talle, color]
    );

    const manejarTalle = (evento) => {
        const nuevoTalle = evento.target.value;
        setTalle(nuevoTalle);
        const primerColor = variantes.find((variante) => variante.talle === nuevoTalle)?.color ?? "";
        setColor(primerColor);
        setCantidad(1);
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        if (!varianteElegida) return;

        const cantidadNumerica = Math.max(1, Math.trunc(Number(cantidad) || 1));
        if (cantidadNumerica > varianteElegida.cantidad) {
            notificaciones.error(`Solo quedan ${varianteElegida.cantidad} unidades de ese talle/color.`);
            return;
        }

        carrito.agregar(producto, talle, color, cantidadNumerica);
        notificaciones.exito(`"${producto.nombre}" agregado al carrito.`);
        onAgregado?.();
    };

    if (cargando) {
        return <Loader mensaje="Consultando stock..." />;
    }

    if (variantes.length === 0) {
        return <p className="agregar__sinstock">Sin stock por el momento. ¡Volvé a pasar pronto!</p>;
    }

    return (
        <form className="agregar" onSubmit={manejarEnvio} noValidate>
            <div className="agregar__opciones">
                <div className="formulario__campo">
                    <label htmlFor="talle">Talle</label>
                    <select id="talle" value={talle} onChange={manejarTalle}>
                        {talles.map((opcion) => (
                            <option key={opcion} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="formulario__campo">
                    <label htmlFor="color">Color</label>
                    <select
                        id="color"
                        value={color}
                        onChange={(evento) => {
                            setColor(evento.target.value);
                            setCantidad(1);
                        }}
                    >
                        {coloresDelTalle.map((opcion) => (
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
                        max={varianteElegida?.cantidad ?? 1}
                        step="1"
                        value={cantidad}
                        onChange={(evento) => setCantidad(evento.target.value)}
                    />
                </div>
            </div>
            {varianteElegida && (
                <p className="agregar__disponible" aria-live="polite">
                    Quedan {varianteElegida.cantidad} unidades disponibles.
                </p>
            )}
            <button type="submit" className="boton boton--principal">
                Agregar al carrito
            </button>
        </form>
    );
}

export default AddToCartForm;
