import stockRepository from "../repositories/stock.repository.js";
import productoRepository from "../repositories/producto.repository.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { esTextoValido, parsearId } from "../utils/validators.js";

class StockService {
    obtenerPorProducto(idProducto) {
        const id = parsearId(idProducto);
        if (id === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }
        if (!productoRepository.findById(id)) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }
        return stockRepository.findByProducto(id);
    }

    agregarVariante(idProducto, { talle, color, cantidad }) {
        const id = parsearId(idProducto);
        if (id === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }
        if (!productoRepository.findById(id)) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }
        if (!esTextoValido(talle) || !esTextoValido(color) || !Number.isInteger(cantidad) || cantidad < 0) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        if (stockRepository.findVariante(id, talle.trim(), color.trim())) {
            throw new ConflictError(Messages.DUPLICATED_VARIANT);
        }

        return stockRepository.create({ idProducto: id, talle: talle.trim(), color: color.trim(), cantidad });
    }

    actualizarCantidad(idVariante, cantidad) {
        const id = parsearId(idVariante);
        if (id === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }
        if (!Number.isInteger(cantidad) || cantidad < 0) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        const variante = stockRepository.findById(id);
        if (!variante) {
            throw new NotFoundError(Messages.STOCK_NOT_FOUND);
        }

        variante.cantidad = cantidad;
        return variante;
    }
}

export default new StockService();
