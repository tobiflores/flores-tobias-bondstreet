import { formatearPrecio } from "../utils/formato.js";

function ProductDetail({ producto }) {
    return (
        <dl className="detalle">
            <div className="detalle__fila">
                <dt>Nombre</dt>
                <dd>{producto.nombre}</dd>
            </div>
            <div className="detalle__fila">
                <dt>Descripción</dt>
                <dd>{producto.descripcion}</dd>
            </div>
            <div className="detalle__fila">
                <dt>Categoría</dt>
                <dd>{producto.categoria}</dd>
            </div>
            <div className="detalle__fila">
                <dt>Precio</dt>
                <dd className="detalle__precio">{formatearPrecio(producto.precio)}</dd>
            </div>
        </dl>
    );
}

export default ProductDetail;
