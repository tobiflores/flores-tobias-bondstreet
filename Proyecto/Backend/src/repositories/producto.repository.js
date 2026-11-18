import Producto from "../models/Producto.js";

// Persistencia temporal en memoria
const productos = [
    new Producto(1, "Remera de banda serigrafiada", "Serigrafía artesanal de bandas de punk y metal nacional, algodón pesado", 18000, "remera-banda.jpg", "Ropa"),
    new Producto(2, "Pack x12 stickers graffiti", "Vinilo resistente al agua con diseños de artistas de la galería", 4500, "stickers-graffiti.jpg", "Stickers"),
    new Producto(3, "Pin esmaltado calavera", "Pin de esmalte duro con cierre mariposa, diseño exclusivo de la Bond", 3800, "pin-calavera.jpg", "Pines y parches"),
    new Producto(4, "Seña sesión de tatuaje flash", "Reservá tu lugar con los tatuadores residentes del primer piso", 25000, "tattoo-flash.jpg", "Tattoo"),
    new Producto(5, "Piercing de acero quirúrgico", "Joya de acero 316L con colocación profesional en el local", 15000, "piercing-acero.jpg", "Piercing"),
    new Producto(6, "Vinilo punk nacional ed. limitada", "Edición numerada de 300 copias, exclusiva de la disquería del subsuelo", 38000, "vinilo-punk.jpg", "Música"),
    new Producto(7, "Cómic independiente autoeditado", "Historieta de autor publicada en la feria de fanzines de la galería", 9000, "comic-indie.jpg", "Cómics"),
    new Producto(8, "Tabla de skate serigrafiada", "Maple canadiense de 8 pulgadas ilustrada por graffiteros de la Bond", 65000, "tabla-skate.jpg", "Skate"),
    new Producto(9, "Buzo oversize pintado a mano", "Buzo con capucha intervenido con aerosol, pieza única", 56000, "buzo-graffiti.jpg", "Ropa"),
    new Producto(10, "Gargantilla gótica con tachas", "Cuero y tachas cromadas de diseño independiente", 12000, "gargantilla-gotica.jpg", "Accesorios")
];

let siguienteId = 11;

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
