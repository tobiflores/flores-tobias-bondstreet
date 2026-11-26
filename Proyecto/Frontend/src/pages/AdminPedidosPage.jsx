import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { obtenerTodosPedidos, avanzarEstadoPedido, cancelarPedido } from "../services/pedidos.service.js";
import { formatearPrecio, formatearFecha } from "../utils/formato.js";
import { SIGUIENTE_ESTADO, esCancelable, claseEstado } from "../utils/estados.js";
import AdminNav from "../components/AdminNav.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Loader from "../components/Loader.jsx";

function AdminPedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [cancelando, setCancelando] = useState(null);
    const { token } = useAuth();
    const notificaciones = useNotificaciones();

    const cargar = async () => {
        try {
            setPedidos(await obtenerTodosPedidos(token));
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

    const manejarAvance = async (pedido) => {
        setProcesando(true);
        try {
            const actualizado = await avanzarEstadoPedido(pedido.id, token);
            const seguimiento = actualizado.envio?.codigoSeguimiento;
            notificaciones.exito(
                `Pedido #${pedido.id} ahora está "${actualizado.pedido.estado}".` +
                    (actualizado.pedido.estado === "Enviado" && seguimiento ? ` Seguimiento: ${seguimiento}` : "")
            );
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setProcesando(false);
        }
    };

    const manejarCancelar = async () => {
        setProcesando(true);
        try {
            await cancelarPedido(cancelando.id, token);
            notificaciones.exito(`Pedido #${cancelando.id} cancelado. El stock fue devuelto.`);
            setCancelando(null);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setProcesando(false);
        }
    };

    return (
        <section className="seccion" aria-labelledby="titulo-admin-pedidos">
            <h1 id="titulo-admin-pedidos" className="seccion__titulo">
                Gestión de pedidos
            </h1>
            <AdminNav />

            {cargando ? (
                <Loader mensaje="Cargando pedidos..." />
            ) : pedidos.length === 0 ? (
                <p className="seccion__vacio">Todavía no hay pedidos registrados.</p>
            ) : (
                <div className="tabla__contenedor">
                    <table className="tabla">
                        <caption className="visualmente-oculto">Listado de todos los pedidos</caption>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Items</th>
                                <th scope="col">Total</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Envío</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(({ pedido, detalles, envio, nombreCliente }) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{nombreCliente}</td>
                                    <td>{formatearFecha(pedido.fecha)}</td>
                                    <td>
                                        <ul className="pedido__items pedido__items--compacto">
                                            {detalles.map((detalle) => (
                                                <li key={detalle.id}>
                                                    {detalle.cantidad}× {detalle.nombreProducto} ({detalle.talle}/
                                                    {detalle.color})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{formatearPrecio(pedido.total)}</td>
                                    <td>
                                        <span className={`estado estado--${claseEstado(pedido.estado)}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {envio?.direccionEntrega}
                                        {envio?.codigoSeguimiento && (
                                            <>
                                                <br />
                                                <span className="pedido__variante">{envio.codigoSeguimiento}</span>
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <div className="tabla__acciones">
                                            {SIGUIENTE_ESTADO[pedido.estado] && (
                                                <button
                                                    type="button"
                                                    className="boton boton--secundario boton--chico"
                                                    onClick={() => manejarAvance(pedido)}
                                                    disabled={procesando}
                                                >
                                                    → {SIGUIENTE_ESTADO[pedido.estado]}
                                                </button>
                                            )}
                                            {esCancelable(pedido.estado) && (
                                                <button
                                                    type="button"
                                                    className="boton boton--peligro boton--chico"
                                                    onClick={() => setCancelando(pedido)}
                                                    disabled={procesando}
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {cancelando && (
                <ConfirmDialog
                    titulo="Cancelar pedido"
                    mensaje={`¿Cancelar el pedido #${cancelando.id}? El stock de los productos será devuelto.`}
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

export default AdminPedidosPage;
