import StockProducto from "../models/StockProducto.js";

// Persistencia temporal en memoria: variantes de talle/color por producto
const stock = [
    new StockProducto(1, 1, "S", "Negro", 8),
    new StockProducto(2, 1, "M", "Negro", 10),
    new StockProducto(3, 1, "L", "Negro", 6),
    new StockProducto(4, 1, "XL", "Negro", 4),
    new StockProducto(5, 1, "M", "Blanco", 5),
    new StockProducto(6, 2, "Único", "Surtido", 50),
    new StockProducto(7, 3, "Único", "Plateado", 25),
    new StockProducto(8, 4, "Único", "Único", 10),
    new StockProducto(9, 5, "Único", "Plateado", 12),
    new StockProducto(10, 5, "Único", "Negro", 8),
    new StockProducto(11, 6, "Único", "Negro", 15),
    new StockProducto(12, 7, "Único", "Único", 30),
    new StockProducto(13, 8, "8.0", "Surtido", 6),
    new StockProducto(14, 8, "8.25", "Surtido", 4),
    new StockProducto(15, 9, "S", "Negro", 4),
    new StockProducto(16, 9, "M", "Negro", 6),
    new StockProducto(17, 9, "L", "Negro", 5),
    new StockProducto(18, 9, "M", "Verde", 2),
    new StockProducto(19, 10, "Único", "Negro", 10)
];

let siguienteId = 20;

class StockRepository {
    findByProducto(idProducto) {
        return stock.filter((variante) => variante.idProducto === idProducto);
    }

    findById(id) {
        return stock.find((variante) => variante.id === id) ?? null;
    }

    findVariante(idProducto, talle, color) {
        return stock.find(
            (variante) =>
                variante.idProducto === idProducto &&
                variante.talle.toLowerCase() === talle.toLowerCase() &&
                variante.color.toLowerCase() === color.toLowerCase()
        ) ?? null;
    }

    create({ idProducto, talle, color, cantidad }) {
        const variante = new StockProducto(siguienteId++, idProducto, talle, color, cantidad);
        stock.push(variante);
        return variante;
    }
}

export default new StockRepository();
