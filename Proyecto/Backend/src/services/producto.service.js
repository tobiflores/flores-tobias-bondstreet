import productoRepository from "../repositories/producto.repository.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError, ConflictError } from "../exceptions/AppError.js";
import { esTextoValido, esNumeroPositivo, parsearId } from "../utils/validators.js";

class ProductoService {
    obtenerTodos() {
        return productoRepository.findAll();
    }

    obtenerPorId(id) {
        const idParseado = parsearId(id);
        if (idParseado === null) {
            throw new BadRequestError(Messages.INVALID_ID);
        }

        const producto = productoRepository.findById(idParseado);
        if (!producto) {
            throw new NotFoundError(Messages.PRODUCT_NOT_FOUND);
        }

        return producto;
    }

    crear(datos) {
        this.#validarDatos(datos);

        if (productoRepository.findByNombre(datos.nombre)) {
            throw new ConflictError(Messages.DUPLICATED_RESOURCE);
        }

        return productoRepository.create(datos);
    }

    actualizar(id, datos) {
        const producto = this.obtenerPorId(id);
        this.#validarDatos(datos);

        const existente = productoRepository.findByNombre(datos.nombre);
        if (existente && existente.id !== producto.id) {
            throw new ConflictError(Messages.DUPLICATED_RESOURCE);
        }

        return productoRepository.update(producto.id, {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            precio: datos.precio,
            imagen: datos.imagen,
            categoria: datos.categoria
        });
    }

    eliminar(id) {
        const producto = this.obtenerPorId(id);
        return productoRepository.delete(producto.id);
    }

    #validarDatos({ nombre, descripcion, precio, imagen, categoria }) {
        const esValido =
            esTextoValido(nombre) &&
            esTextoValido(descripcion) &&
            esNumeroPositivo(precio) &&
            esTextoValido(imagen) &&
            esTextoValido(categoria);

        if (!esValido) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
    }
}

export default new ProductoService();
