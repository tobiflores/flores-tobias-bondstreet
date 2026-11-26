import Cupon from "../models/Cupon.js";

// Persistencia temporal en memoria
const cupones = [
    new Cupon(1, "BOND10", 10, "2027-12-31", true),
    new Cupon(2, "PUNK20", 20, "2025-06-30", true),
    new Cupon(3, "GRAFF15", 15, "2027-12-31", false)
];

let siguienteId = 4;

class CuponRepository {
    findAll() {
        return cupones;
    }

    findById(id) {
        return cupones.find((cupon) => cupon.id === id) ?? null;
    }

    findByCodigo(codigo) {
        return cupones.find(
            (cupon) => cupon.codigo.toLowerCase() === codigo.toLowerCase()
        ) ?? null;
    }

    create({ codigo, porcentajeDescuento, fechaVencimiento }) {
        const cupon = new Cupon(siguienteId++, codigo, porcentajeDescuento, fechaVencimiento, true);
        cupones.push(cupon);
        return cupon;
    }
}

export default new CuponRepository();
