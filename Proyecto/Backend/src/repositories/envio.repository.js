import Envio from "../models/Envio.js";
import { EstadosDespacho } from "../enums/EstadosDespacho.js";

// Persistencia temporal en memoria
const envios = [];

let siguienteId = 1;

class EnvioRepository {
    create({ idPedido, direccionEntrega }) {
        const envio = new Envio(
            siguienteId++,
            idPedido,
            direccionEntrega,
            EstadosDespacho.EN_DEPOSITO,
            null,
            null
        );
        envios.push(envio);
        return envio;
    }

    findByPedido(idPedido) {
        return envios.find((envio) => envio.idPedido === idPedido) ?? null;
    }
}

export default new EnvioRepository();
