import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNotificaciones } from "./Notifications.jsx";
import { obtenerStock, agregarVariante, actualizarCantidadStock } from "../services/stock.service.js";
import Loader from "./Loader.jsx";

const NUEVA_VARIANTE = { talle: "", color: "", cantidad: "" };

// Gestión de variantes (talle/color/cantidad) de un producto, para el admin
function StockManager({ producto }) {
    const [variantes, setVariantes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [cantidades, setCantidades] = useState({});
    const [nueva, setNueva] = useState(NUEVA_VARIANTE);
    const { token } = useAuth();
    const notificaciones = useNotificaciones();

    const cargar = async () => {
        try {
            const stock = await obtenerStock(producto.id);
            setVariantes(stock);
            setCantidades(Object.fromEntries(stock.map((variante) => [variante.id, variante.cantidad])));
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [producto.id]);

    const guardarCantidad = async (variante) => {
        const cantidad = Math.trunc(Number(cantidades[variante.id]));
        if (Number.isNaN(cantidad) || cantidad < 0) {
            notificaciones.error("La cantidad debe ser un número mayor o igual a cero.");
            return;
        }
        setGuardando(true);
        try {
            await actualizarCantidadStock(variante.id, cantidad, token);
            notificaciones.exito(`Stock de ${variante.talle}/${variante.color} actualizado a ${cantidad}.`);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const agregarNueva = async (evento) => {
        evento.preventDefault();
        const cantidad = Math.trunc(Number(nueva.cantidad));
        if (!nueva.talle.trim() || !nueva.color.trim() || Number.isNaN(cantidad) || cantidad < 0) {
            notificaciones.error("Completá talle, color y una cantidad válida.");
            return;
        }
        setGuardando(true);
        try {
            await agregarVariante(producto.id, { talle: nueva.talle.trim(), color: nueva.color.trim(), cantidad }, token);
            notificaciones.exito(`Variante ${nueva.talle}/${nueva.color} agregada.`);
            setNueva(NUEVA_VARIANTE);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return <Loader mensaje="Cargando stock..." />;
    }

    return (
        <div className="stock">
            {variantes.length === 0 ? (
                <p className="seccion__vacio">Este producto todavía no tiene variantes cargadas.</p>
            ) : (
                <table className="tabla tabla--stock">
                    <caption className="visualmente-oculto">Variantes de stock de {producto.nombre}</caption>
                    <thead>
                        <tr>
                            <th scope="col">Talle</th>
                            <th scope="col">Color</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variantes.map((variante) => (
                            <tr key={variante.id}>
                                <td>{variante.talle}</td>
                                <td>{variante.color}</td>
                                <td>
                                    <label className="visualmente-oculto" htmlFor={`cantidad-${variante.id}`}>
                                        Cantidad de {variante.talle} {variante.color}
                                    </label>
                                    <input
                                        id={`cantidad-${variante.id}`}
                                        className="stock__cantidad"
                                        type="number"
                                        min="0"
                                        value={cantidades[variante.id] ?? ""}
                                        onChange={(evento) =>
                                            setCantidades((previas) => ({
                                                ...previas,
                                                [variante.id]: evento.target.value
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="boton boton--secundario boton--chico"
                                        onClick={() => guardarCantidad(variante)}
                                        disabled={guardando}
                                    >
                                        Guardar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <form className="stock__nueva" onSubmit={agregarNueva}>
                <h3 className="stock__subtitulo">Agregar variante</h3>
                <div className="agregar__opciones">
                    <div className="formulario__campo">
                        <label htmlFor="nuevo-talle">Talle</label>
                        <input
                            id="nuevo-talle"
                            type="text"
                            placeholder="Ej: M"
                            value={nueva.talle}
                            onChange={(evento) => setNueva((previa) => ({ ...previa, talle: evento.target.value }))}
                        />
                    </div>
                    <div className="formulario__campo">
                        <label htmlFor="nuevo-color">Color</label>
                        <input
                            id="nuevo-color"
                            type="text"
                            placeholder="Ej: Negro"
                            value={nueva.color}
                            onChange={(evento) => setNueva((previa) => ({ ...previa, color: evento.target.value }))}
                        />
                    </div>
                    <div className="formulario__campo">
                        <label htmlFor="nueva-cantidad">Cantidad</label>
                        <input
                            id="nueva-cantidad"
                            type="number"
                            min="0"
                            value={nueva.cantidad}
                            onChange={(evento) => setNueva((previa) => ({ ...previa, cantidad: evento.target.value }))}
                        />
                    </div>
                </div>
                <button type="submit" className="boton boton--principal" disabled={guardando}>
                    {guardando ? "Guardando..." : "Agregar variante"}
                </button>
            </form>
        </div>
    );
}

export default StockManager;
