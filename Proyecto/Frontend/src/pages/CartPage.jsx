import { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../components/CartContext.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { crearPedido } from "../services/pedidos.service.js";
import { validarCupon } from "../services/cupones.service.js";
import { formatearPrecio } from "../utils/formato.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

function CartPage() {
    const carrito = useCarrito();
    const { usuario, token } = useAuth();
    const notificaciones = useNotificaciones();
    const [direccion, setDireccion] = useState("");
    const [errorDireccion, setErrorDireccion] = useState("");
    const [codigoCupon, setCodigoCupon] = useState("");
    const [cuponAplicado, setCuponAplicado] = useState(null);
    const [validandoCupon, setValidandoCupon] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [quitando, setQuitando] = useState(null);
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

    const subtotal = carrito.total;
    const descuento = cuponAplicado ? Math.round((subtotal * cuponAplicado.porcentajeDescuento) / 100) : 0;
    const total = subtotal - descuento;

    const aplicarCupon = async () => {
        if (!codigoCupon.trim()) return;
        setValidandoCupon(true);
        try {
            const cupon = await validarCupon(codigoCupon.trim(), token);
            setCuponAplicado(cupon);
            notificaciones.exito(`Cupón ${cupon.codigo} aplicado: ${cupon.porcentajeDescuento}% de descuento.`);
        } catch (error) {
            setCuponAplicado(null);
            notificaciones.error(error.message);
        } finally {
            setValidandoCupon(false);
        }
    };

    const confirmarPedido = async () => {
        if (!direccion.trim()) {
            setErrorDireccion("Ingresá la dirección de entrega.");
            return;
        }
        setErrorDireccion("");
        setEnviando(true);
        try {
            const items = carrito.items.map((item) => ({
                idProducto: item.idProducto,
                talle: item.talle,
                color: item.color,
                cantidad: item.cantidad
            }));
            const resultado = await crearPedido(
                {
                    items,
                    direccionEntrega: direccion.trim(),
                    codigoCupon: cuponAplicado?.codigo
                },
                token
            );
            carrito.vaciar();
            setPedidoConfirmado(resultado);
            notificaciones.exito(`Pedido #${resultado.pedido.id} confirmado correctamente.`);
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    if (pedidoConfirmado) {
        const { pedido, envio, descuento: descuentoAplicado } = pedidoConfirmado;
        return (
            <section className="seccion seccion--centrada" aria-labelledby="titulo-confirmado">
                <h1 id="titulo-confirmado">¡Pedido confirmado!</h1>
                <p className="carrito__confirmado">
                    Tu pedido <strong>#{pedido.id}</strong> por <strong>{formatearPrecio(pedido.total)}</strong>
                    {descuentoAplicado > 0 && <> (ahorraste {formatearPrecio(descuentoAplicado)})</>} quedó en estado{" "}
                    <strong>{pedido.estado}</strong> y se enviará a <strong>{envio.direccionEntrega}</strong>.
                    Podés seguirlo desde "Mis pedidos". ¡Gracias por bancar la Bond!
                </p>
                <div className="hero__acciones">
                    <Link to="/mis-pedidos" className="boton boton--principal">
                        Ver mis pedidos
                    </Link>
                    <Link to="/catalogo" className="boton boton--secundario">
                        Seguir comprando
                    </Link>
                </div>
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

                    {usuario ? (
                        <div className="checkout">
                            <div className="checkout__datos">
                                <div className="formulario__campo">
                                    <label htmlFor="direccion">Dirección de entrega</label>
                                    <input
                                        id="direccion"
                                        type="text"
                                        placeholder="Ej: Av. Santa Fe 1234, CABA"
                                        value={direccion}
                                        onChange={(evento) => {
                                            setDireccion(evento.target.value);
                                            if (errorDireccion) setErrorDireccion("");
                                        }}
                                        aria-invalid={Boolean(errorDireccion)}
                                        aria-describedby={errorDireccion ? "error-direccion" : undefined}
                                    />
                                    {errorDireccion && (
                                        <p className="formulario__error" id="error-direccion" role="alert">
                                            {errorDireccion}
                                        </p>
                                    )}
                                </div>

                                <div className="formulario__campo">
                                    <label htmlFor="cupon">Cupón de descuento (opcional)</label>
                                    <div className="checkout__cupon">
                                        <input
                                            id="cupon"
                                            type="text"
                                            placeholder="Ej: BOND10"
                                            value={codigoCupon}
                                            onChange={(evento) => setCodigoCupon(evento.target.value.toUpperCase())}
                                            disabled={Boolean(cuponAplicado)}
                                        />
                                        {cuponAplicado ? (
                                            <button
                                                type="button"
                                                className="boton boton--peligro boton--chico"
                                                onClick={() => {
                                                    setCuponAplicado(null);
                                                    setCodigoCupon("");
                                                }}
                                            >
                                                Quitar
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="boton boton--secundario boton--chico"
                                                onClick={aplicarCupon}
                                                disabled={validandoCupon || !codigoCupon.trim()}
                                            >
                                                {validandoCupon ? "Validando..." : "Aplicar"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="checkout__resumen">
                                <p>
                                    Subtotal: <span>{formatearPrecio(subtotal)}</span>
                                </p>
                                {cuponAplicado && (
                                    <p className="checkout__descuento">
                                        {cuponAplicado.codigo} (−{cuponAplicado.porcentajeDescuento}%):{" "}
                                        <span>−{formatearPrecio(descuento)}</span>
                                    </p>
                                )}
                                <p className="carrito__total">
                                    Total: <strong>{formatearPrecio(total)}</strong>
                                </p>
                                <button
                                    type="button"
                                    className="boton boton--principal"
                                    onClick={confirmarPedido}
                                    disabled={enviando}
                                >
                                    {enviando ? "Confirmando..." : "Confirmar pedido"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="carrito__resumen">
                            <p className="carrito__total">
                                Total: <strong>{formatearPrecio(subtotal)}</strong>
                            </p>
                            <p className="carrito__aviso">
                                <Link to="/login">Iniciá sesión</Link> o{" "}
                                <Link to="/registro">creá tu cuenta</Link> para confirmar el pedido.
                            </p>
                        </div>
                    )}
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
                    textoConfirmar="Quitar"
                    textoVolver="Volver"
                />
            )}
        </section>
    );
}

export default CartPage;
