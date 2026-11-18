class Pedido {
    constructor(id, idCliente, fecha, estado, total, idCupon) {
        this.id = id;
        this.idCliente = idCliente;
        this.fecha = fecha;
        this.estado = estado;
        this.total = total;
        this.idCupon = idCupon;
    }
}

export default Pedido;
