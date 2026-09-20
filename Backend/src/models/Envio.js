class Envio {
    constructor(id, idPedido, direccionEntrega, estadoDespacho, fechaDespacho, codigoSeguimiento) {
        this.id = id;
        this.idPedido = idPedido;
        this.direccionEntrega = direccionEntrega;
        this.estadoDespacho = estadoDespacho;
        this.fechaDespacho = fechaDespacho;
        this.codigoSeguimiento = codigoSeguimiento;
    }
}

export default Envio;
