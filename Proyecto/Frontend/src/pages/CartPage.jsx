import { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { crearPedido } from "../services/pedidos.service.js";
import { formatearPrecio } from "../utils/formato.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

function CartPage() {
    const carrito = useCarrito();
    const { usuario, token } = useAuth();
    const notificaciones = useNotificaciones();
    const [enviando, setEnviando] = useState(false);
    const [quitando, setQuitando] = useState(null);
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

    const confirmarPedido = async () => {
        setEnviando(true);
        try {
            const items = carrito.items.map((item) => ({
                idProducto: item.idProducto,
                talle: item.talle,
                color: item.color,
                cantidad: item.cantidad
            }));
            const resultado = await crearPedido(items, token);
            carrito.vaciar();
            setPedidoConfirmado(resultado.pedido);
            notificaciones.exito(`Pedido #${resultado.pedido.id} confirmado correctamente.`);
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    if (pedidoConfirmado) {
        return (
            <section className="seccion seccion--centrada" aria-labelledby="titulo-confirmado">
                <h1 id="titulo-confirmado">¡Pedido confirmado!</h1>
                <p className="carrito__confirmado">
                    Tu pedido <strong>#{pedidoConfirmado.id}</strong> por{" "}
                    <strong>{formatearPrecio(pedidoConfirmado.total)}</strong> quedó en estado{" "}
                    <strong>{pedidoConfirmado.estado}</strong>. ¡Gracias por bancar la Bond!
                </p>
                <Link to="/catalogo" className="boton boton--principal">
                    Seguir comprando
                </Link>
            </section>
        );
    }

    return (
        <section className="seccion" aria-labelledby="titulo-carrito">
            <h1 id="titulo-carrito" className="seccion__titulo">
                Tu carrito
            </h1>

            {carrito.items.length === 0 ? (
                <div className="carrito__vacio">
                    <p className="seccion__vacio">El carrito está vacío.</p>
                    <Link to="/catalogo" className="boton boton--principal">
                        Ir al catálogo
                    </Link>
                </div>
            ) : (
                <>
                    <div className="tabla__contenedor">
                        <table className="tabla">
                            <caption className="visualmente-oculto">Productos en tu carrito</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Talle</th>
                                    <th scope="col">Color</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Subtotal</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.items.map((item) => (
                                    <tr key={item.clave}>
                                        <td>{item.nombre}</td>
                                        <td>{item.talle}</td>
                                        <td>{item.color}</td>
                                        <td>
                                            <div className="stepper">
                                                <button
                                                    type="button"
                                                    className="boton boton--secundario boton--chico"
                                                    aria-label={`Restar una unidad de ${item.nombre}`}
                                                    onClick={() => carrito.cambiarCantidad(item.clave, item.cantidad - 1)}
                                                    disabled={item.cantidad <= 1}
                                                >
                                                    −
                                                </button>
                                                <span aria-live="polite">{item.cantidad}</span>
                                                <button
                                                    type="button"
                                                    className="boton boton--secundario boton--chico"
                                                    aria-label={`Sumar una unidad de ${item.nombre}`}
                                                    onClick={() => carrito.cambiarCantidad(item.clave, item.cantidad + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="boton boton--peligro boton--chico"
                                                onClick={() => setQuitando(item)}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="carrito__resumen">
                        <p className="carrito__total">
                            Total: <strong>{formatearPrecio(carrito.total)}</strong>
                        </p>
                        {usuario ? (
                            <button
                                type="button"
                                className="boton boton--principal"
                                onClick={confirmarPedido}
                                disabled={enviando}
                            >
                                {enviando ? "Confirmando..." : "Confirmar pedido"}
                            </button>
                        ) : (
                            <p className="carrito__aviso">
                                <Link to="/login">Iniciá sesión</Link> o{" "}
                                <Link to="/registro">creá tu cuenta</Link> para confirmar el pedido.
                            </p>
                        )}
                    </div>
                </>
            )}

            {quitando && (
                <ConfirmDialog
                    titulo="Quitar del carrito"
                    mensaje={`¿Querés quitar "${quitando.nombre}" (${quitando.talle} / ${quitando.color}) del carrito?`}
                    onConfirmar={() => {
                        carrito.quitar(quitando.clave);
                        setQuitando(null);
                    }}
                    onCancelar={() => setQuitando(null)}
                />
            )}
        </section>
    );
}

export default CartPage;
