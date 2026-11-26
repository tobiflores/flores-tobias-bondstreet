import cuponRepository from "../repositories/cupon.repository.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { esTextoValido, parsearId } from "../utils/validators.js";

class CuponService {
    listar() {
        return cuponRepository.findAll();
    }

    crear({ codigo, porcentajeDescuento, fechaVencimiento }) {
        const porcentaje = Number(porcentajeDescuento);
        const esFechaValida = esTextoValido(fechaVencimiento) && !Number.isNaN(Date.parse(fechaVencimiento));

        if (!esTextoValido(codigo) || !Number.isInteger(porcentaje) || porcentaje < 1 || porcentaje > 100 || !esFechaValida) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        if (cuponRepository.findByCodigo(codigo.trim())) {
            throw new ConflictError(Messages.DUPLICATED_CUPON);
        }

        return cuponRepository.create({
            codigo: codigo.trim().toUpperCase(),
            porcentajeDescuento: porcentaje,
            fechaVencimiento
        });
    }

    alternar(id) {
        const idParseado = parsearId(id);
        if (idParseado === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }

        const cupon = cuponRepository.findById(idParseado);
        if (!cupon) {
            throw new NotFoundError(Messages.CUPON_INVALID);
        }

        cupon.activo = !cupon.activo;
        return cupon;
    }

    // Regla de negocio: solo cupones activos y sin vencer son aplicables
    validar(codigo) {
        if (!esTextoValido(codigo)) {
            throw new BadRequestError(Messages.CUPON_INVALID);
        }

        const cupon = cuponRepository.findByCodigo(codigo.trim());
        const vencido = cupon && new Date(cupon.fechaVencimiento) < new Date();

        if (!cupon || !cupon.activo || vencido) {
            throw new BadRequestError(Messages.CUPON_INVALID);
        }

        return cupon;
    }
}

export default new CuponService();
