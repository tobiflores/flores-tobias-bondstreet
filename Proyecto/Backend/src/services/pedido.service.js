import crypto from "crypto";
import pedidoRepository from "../repositories/pedido.repository.js";
import productoRepository from "../repositories/producto.repository.js";
import stockRepository from "../repositories/stock.repository.js";
import envioRepository from "../repositories/envio.repository.js";
import usuarioRepository from "../repositories/usuario.repository.js";
import cuponService from "./cupon.service.js";
import { Messages } from "../enums/Messages.js";
import { EstadosPedido } from "../enums/EstadosPedido.js";
import { EstadosDespacho } from "../enums/EstadosDespacho.js";
import { Roles } from "../enums/Roles.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../exceptions/AppError.js";
import { esTextoValido, esCantidadValida, parsearId } from "../utils/validators.js";

// Transiciones permitidas del flujo: Confirmado → En preparación → Enviado → Entregado
const SIGUIENTE_ESTADO = {
    [EstadosPedido.CONFIRMADO]: EstadosPedido.EN_PREPARACION,
    [EstadosPedido.EN_PREPARACION]: EstadosPedido.ENVIADO,
    [EstadosPedido.ENVIADO]: EstadosPedido.ENTREGADO
};

const CANCELABLES = [EstadosPedido.CONFIRMADO, EstadosPedido.EN_PREPARACION];

class PedidoService {
    crear(usuario, { items, direccionEntrega, codigoCupon } = {}) {
        if (!esTextoValido(direccionEntrega)) {
            throw new BadRequestError(Messages.ADDRESS_REQUIRED);
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestError(Messages.EMPTY_ORDER);
        }

        // Validación de cada item contra el stock real por talle/color
        const itemsValidados = items.map((item) => {
            if (!esCantidadValida(item?.cantidad) || !esTextoValido(item?.talle) || !esTextoValido(item?.color)) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }

            const producto = productoRepository.findById(Number(item.idProducto));
            if (!producto) {
                throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
            }

            const variante = stockRepository.findVariante(producto.id, item.talle.trim(), item.color.trim());
            if (!variante) {
                throw new BadRequestError(Messages.VARIANT_NOT_FOUND);
            }
            if (variante.cantidad < item.cantidad) {
                throw new BadRequestError(Messages.INSUFFICIENT_STOCK);
            }

            return {
                idProducto: producto.id,
                talle: variante.talle,
                color: variante.color,
                cantidad: item.cantidad,
                // el precio se toma del servidor, nunca del cliente
                precioUnitario: producto.precio,
                variante
            };
        });

        const subtotal = itemsValidados.reduce(
            (suma, item) => suma + item.precioUnitario * item.cantidad,
            0
        );

        // Regla de negocio: los descuentos solo aplican con un cupón válido
        const cupon = esTextoValido(codigoCupon) ? cuponService.validar(codigoCupon) : null;
        const descuento = cupon ? Math.round((subtotal * cupon.porcentajeDescuento) / 100) : 0;
        const total = subtotal - descuento;

        // Con todo validado, se descuenta el stock
        itemsValidados.forEach((item) => {
            item.variante.cantidad -= item.cantidad;
        });

        const { pedido, detalles } = pedidoRepository.create(
            {
                idCliente: usuario.id,
                fecha: new Date().toISOString(),
                estado: EstadosPedido.CONFIRMADO,
                total,
                idCupon: cupon?.id ?? null
            },
            itemsValidados
        );

        const envio = envioRepository.create({ idPedido: pedido.id, direccionEntrega: direccionEntrega.trim() });

        return { pedido, detalles: detalles.map(enriquecerDetalle), envio, subtotal, descuento };
    }

    obtenerPropios(usuario) {
        return pedidoRepository
            .findByCliente(usuario.id)
            .map(enriquecerPedido)
            .sort(masRecientePrimero);
    }

    obtenerTodos() {
        return pedidoRepository
            .findAll()
            .map((registro) => {
                const enriquecido = enriquecerPedido(registro);
                const cliente = usuarioRepository.findById(registro.pedido.idCliente);
                return { ...enriquecido, nombreCliente: cliente?.nombre ?? "Desconocido" };
            })
            .sort(masRecientePrimero);
    }

    // Regla de negocio: el dueño puede cancelar solo si el pedido no fue despachado
    cancelar(usuario, idPedido) {
        const pedido = this.#buscarPedido(idPedido);

        if (pedido.idCliente !== usuario.id && usuario.rol !== Roles.ADMINISTRADOR) {
            throw new ForbiddenError(Messages.FORBIDDEN);
        }
        if (!CANCELABLES.includes(pedido.estado)) {
            throw new BadRequestError(Messages.ORDER_NOT_CANCELABLE);
        }

        // Se devuelve el stock de cada item
        pedidoRepository.findDetalles(pedido.id).forEach((detalle) => {
            const variante = stockRepository.findVariante(detalle.idProducto, detalle.talle, detalle.color);
            if (variante) {
                variante.cantidad += detalle.cantidad;
            }
        });

        pedido.estado = EstadosPedido.CANCELADO;

        const envio = envioRepository.findByPedido(pedido.id);
        if (envio) {
            envio.estadoDespacho = EstadosDespacho.CANCELADO;
        }

        return enriquecerPedido({ pedido, detalles: pedidoRepository.findDetalles(pedido.id) });
    }

    // Solo el admin avanza el pedido al siguiente estado del flujo
    avanzarEstado(idPedido) {
        const pedido = this.#buscarPedido(idPedido);
        const siguiente = SIGUIENTE_ESTADO[pedido.estado];

        if (!siguiente) {
            throw new BadRequestError(Messages.INVALID_STATE_TRANSITION);
        }

        pedido.estado = siguiente;

        // Al despachar se genera el código de seguimiento
        if (siguiente === EstadosPedido.ENVIADO) {
            const envio = envioRepository.findByPedido(pedido.id);
            if (envio) {
                envio.estadoDespacho = EstadosDespacho.DESPACHADO;
                envio.fechaDespacho = new Date().toISOString();
                envio.codigoSeguimiento = `BOND-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
            }
        }

        return enriquecerPedido({ pedido, detalles: pedidoRepository.findDetalles(pedido.id) });
    }

    #buscarPedido(idPedido) {
        const id = parsearId(idPedido);
        if (id === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }

        const pedido = pedidoRepository.findById(id);
        if (!pedido) {
            throw new NotFoundError(Messages.ORDER_NOT_FOUND);
        }

        return pedido;
    }
}

function masRecientePrimero(a, b) {
    return b.pedido.id - a.pedido.id;
}

function enriquecerDetalle(detalle) {
    const producto = productoRepository.findById(detalle.idProducto);
    return { ...detalle, nombreProducto: producto?.nombre ?? "Producto eliminado" };
}

function enriquecerPedido({ pedido, detalles }) {
    return {
        pedido,
        detalles: detalles.map(enriquecerDetalle),
        envio: envioRepository.findByPedido(pedido.id)
    };
}

export default new PedidoService();
