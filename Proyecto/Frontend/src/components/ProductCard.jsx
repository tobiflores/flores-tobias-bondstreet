import { useState } from "react";
import { formatearPrecio } from "../utils/formato.js";

function ProductCard({ producto, acciones }) {
    const [imagenRota, setImagenRota] = useState(false);
    const tieneImagenValida = /^https?:\/\//.test(producto.imagen) && !imagenRota;

    return (
        <article className="tarjeta">
            {tieneImagenValida ? (
                <img
                    className="tarjeta__imagen"
                    src={producto.imagen}
                    alt={`Foto del producto ${producto.nombre}`}
                    onError={() => setImagenRota(true)}
                />
            ) : (
                <div className="tarjeta__imagen tarjeta__imagen--placeholder" role="img" aria-label={`Imagen no disponible de ${producto.nombre}`}>
                    <span aria-hidden="true">{producto.nombre.charAt(0).toUpperCase()}</span>
                </div>
            )}
            <div className="tarjeta__cuerpo">
                <p className="tarjeta__categoria">{producto.categoria}</p>
                <h3 className="tarjeta__nombre">{producto.nombre}</h3>
                <p className="tarjeta__precio">{formatearPrecio(producto.precio)}</p>
                {acciones && <div className="tarjeta__acciones">{acciones}</div>}
            </div>
        </article>
    );
}

export default ProductCard;
