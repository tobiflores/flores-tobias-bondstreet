import pedidoRepository from "../repositories/pedido.repository.js";
import productoRepository from "../repositories/producto.repository.js";
import { Messages } from "../enums/Messages.js";
import { EstadosPedido } from "../enums/EstadosPedido.js";
import { BadRequestError, NotFoundError } from "../exceptions/AppError.js";
import { esTextoValido, esCantidadValida } from "../utils/validators.js";

class PedidoService {
    crear(usuario, items) {
        if (!Array.isArray(items) || items.length === 0) {
            throw new BadRequestError(Messages.EMPTY_ORDER);
        }

        const itemsValidados = items.map((item) => {
            if (!esCantidadValida(item?.cantidad) || !esTextoValido(item?.talle) || !esTextoValido(item?.color)) {
                throw new BadRequestError(Messages.INVALID_DATA);
            }

            const producto = productoRepository.findById(Number(item.idProducto));
            if (!producto) {
                throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
            }

            return {
                idProducto: producto.id,
                talle: item.talle.trim(),
                color: item.color.trim(),
                cantidad: item.cantidad,
                // el precio se toma del servidor, nunca del cliente
                precioUnitario: producto.precio
            };
        });

        const total = itemsValidados.reduce(
            (suma, item) => suma + item.precioUnitario * item.cantidad,
            0
        );

        return pedidoRepository.create(
            {
                idCliente: usuario.id,
                fecha: new Date().toISOString(),
                estado: EstadosPedido.CONFIRMADO,
                total
            },
            itemsValidados
        );
    }

    obtenerPropios(usuario) {
        return pedidoRepository.findByCliente(usuario.id);
    }
}

export default new PedidoService();
