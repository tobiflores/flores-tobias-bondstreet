import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { obtenerMisPedidos, cancelarPedido } from "../services/pedidos.service.js";
import { formatearPrecio, formatearFecha } from "../utils/formato.js";
import { esCancelable, claseEstado } from "../utils/estados.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Loader from "../components/Loader.jsx";

function MisPedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [cancelando, setCancelando] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const { token } = useAuth();
    const notificaciones = useNotificaciones();

    const cargar = async () => {
        try {
            setPedidos(await obtenerMisPedidos(token));
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manejarCancelar = async () => {
        setProcesando(true);
        try {
            await cancelarPedido(cancelando.pedido.id, token);
            notificaciones.exito(`Pedido #${cancelando.pedido.id} cancelado. El stock fue devuelto.`);
            setCancelando(null);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <section className="seccion" aria-labelledby="titulo-mis-pedidos">
            <h1 id="titulo-mis-pedidos" className="seccion__titulo">
                Mis pedidos
            </h1>

            {cargando ? (
                <Loader mensaje="Buscando tus pedidos..." />
            ) : pedidos.length === 0 ? (
                <div className="carrito__vacio">
                    <p className="seccion__vacio">Todavía no hiciste ningún pedido.</p>
                    <Link to="/catalogo" className="boton boton--principal">
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <div className="pedidos">
                    {pedidos.map(({ pedido, detalles, envio }) => (
                        <article key={pedido.id} className="pedido" aria-label={`Pedido número ${pedido.id}`}>
                            <header className="pedido__encabezado">
                                <h2 className="pedido__titulo">Pedido #{pedido.id}</h2>
                                <span className={`estado estado--${claseEstado(pedido.estado)}`}>{pedido.estado}</span>
                            </header>

                            <p className="pedido__meta">
                                {formatearFecha(pedido.fecha)} — Total:{" "}
                                <strong>{formatearPrecio(pedido.total)}</strong>
                            </p>

                            <ul className="pedido__items">
                                {detalles.map((detalle) => (
                                    <li key={detalle.id}>
                                        {detalle.cantidad}× {detalle.nombreProducto}{" "}
                                        <span className="pedido__variante">
                                            ({detalle.talle} / {detalle.color})
                                        </span>{" "}
                                        — {formatearPrecio(detalle.precioUnitario * detalle.cantidad)}
                                    </li>
                                ))}
                            </ul>

                            {envio && (
                                <p className="pedido__envio">
                                    Envío a <strong>{envio.direccionEntrega}</strong> — {envio.estadoDespacho}
                                    {envio.codigoSeguimiento && (
                                        <>
                                            {" "}
                                            — Seguimiento: <strong>{envio.codigoSeguimiento}</strong>
                                        </>
                                    )}
                                </p>
                            )}

                            {esCancelable(pedido.estado) && (
                                <button
                                    type="button"
                                    className="boton boton--peligro boton--chico"
                                    onClick={() => setCancelando({ pedido })}
                                >
                                    Cancelar pedido
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            )}

            {cancelando && (
                <ConfirmDialog
                    titulo="Cancelar pedido"
                    mensaje={`¿Seguro que querés cancelar el pedido #${cancelando.pedido.id}? El stock de los productos será devuelto.`}
                    onConfirmar={manejarCancelar}
                    onCancelar={() => setCancelando(null)}
                    confirmando={procesando}
                    textoConfirmar="Sí, cancelar pedido"
                    textoProcesando="Cancelando..."
                    textoVolver="Volver"
                />
            )}
        </section>
    );
}

export default MisPedidosPage;
