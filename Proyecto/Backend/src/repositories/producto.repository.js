import Producto from "../models/Producto.js";

// Persistencia temporal en memoria
const productos = [
    new Producto(1, "Remera Oversize", "Remera de algodón premium", 15000, "remera-oversize.jpg", "Remeras"),
    new Producto(2, "Jean Slim Fit", "Jean elastizado azul oscuro", 42000, "jean-slim.jpg", "Pantalones"),
    new Producto(3, "Campera Puffer", "Campera inflada impermeable", 78000, "campera-puffer.jpg", "Abrigos")
];

let siguienteId = 4;

class ProductoRepository {
    findAll() {
        return productos;
    }

    findById(id) {
        return productos.find((producto) => producto.id === id) ?? null;
    }

    findByNombre(nombre) {
        return productos.find(
            (producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()
        ) ?? null;
    }

    create({ nombre, descripcion, precio, imagen, categoria }) {
        const producto = new Producto(siguienteId++, nombre, descripcion, precio, imagen, categoria);
        productos.push(producto);
        return producto;
    }

    update(id, datos) {
        const producto = this.findById(id);
        if (!producto) return null;
        Object.assign(producto, datos);
        return producto;
    }

    delete(id) {
        const indice = productos.findIndex((producto) => producto.id === id);
        if (indice === -1) return null;
        const [eliminado] = productos.splice(indice, 1);
        return eliminado;
    }
}

export default new ProductoRepository();
