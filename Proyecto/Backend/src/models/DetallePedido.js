class DetallePedido {
    constructor(id, idPedido, idProducto, talle, color, cantidad, precioUnitario) {
        this.id = id;
        this.idPedido = idPedido;
        this.idProducto = idProducto;
        this.talle = talle;
        this.color = color;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }
}

export default DetallePedido;
