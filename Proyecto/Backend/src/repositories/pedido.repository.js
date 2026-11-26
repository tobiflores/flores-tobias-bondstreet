import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";

// Persistencia temporal en memoria
const pedidos = [];
const detalles = [];

let siguientePedidoId = 1;
let siguienteDetalleId = 1;

class PedidoRepository {
    create({ idCliente, fecha, estado, total, idCupon = null }, items) {
        const pedido = new Pedido(siguientePedidoId++, idCliente, fecha, estado, total, idCupon);
        pedidos.push(pedido);

        const detallesPedido = items.map((item) => {
            const detalle = new DetallePedido(
                siguienteDetalleId++,
                pedido.id,
                item.idProducto,
                item.talle,
                item.color,
                item.cantidad,
                item.precioUnitario
            );
            detalles.push(detalle);
            return detalle;
        });

        return { pedido, detalles: detallesPedido };
    }

    findByCliente(idCliente) {
        return pedidos
            .filter((pedido) => pedido.idCliente === idCliente)
            .map((pedido) => ({
                pedido,
                detalles: detalles.filter((detalle) => detalle.idPedido === pedido.id)
            }));
    }

    findAll() {
        return pedidos.map((pedido) => ({
            pedido,
            detalles: detalles.filter((detalle) => detalle.idPedido === pedido.id)
        }));
    }

    findById(id) {
        return pedidos.find((pedido) => pedido.id === id) ?? null;
    }

    findDetalles(idPedido) {
        return detalles.filter((detalle) => detalle.idPedido === idPedido);
    }
}

export default new PedidoRepository();
