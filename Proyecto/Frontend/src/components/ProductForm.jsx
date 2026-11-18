import { useState } from "react";
import { validarProducto } from "../utils/validaciones.js";

const VALORES_VACIOS = {
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: ""
};

function ProductForm({ valoresIniciales = VALORES_VACIOS, onSubmit, enviando = false, textoBoton = "Guardar" }) {
    const [valores, setValores] = useState({
        nombre: valoresIniciales.nombre ?? "",
        descripcion: valoresIniciales.descripcion ?? "",
        precio: valoresIniciales.precio?.toString() ?? "",
        imagen: valoresIniciales.imagen ?? "",
        categoria: valoresIniciales.categoria ?? ""
    });
    const [errores, setErrores] = useState({});

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setValores((previos) => ({ ...previos, [name]: value }));
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        const nuevosErrores = validarProducto(valores);
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) return;

        onSubmit({
            nombre: valores.nombre.trim(),
            descripcion: valores.descripcion.trim(),
            precio: Number(valores.precio),
            imagen: valores.imagen.trim(),
            categoria: valores.categoria.trim()
        });
    };

    return (
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
            <div className="formulario__campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={valores.nombre}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={errores.nombre ? "error-nombre" : undefined}
                />
                {errores.nombre && (
                    <p className="formulario__error" id="error-nombre" role="alert">
                        {errores.nombre}
                    </p>
                )}
            </div>

            <div className="formulario__campo">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={3}
                    value={valores.descripcion}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.descripcion)}
                    aria-describedby={errores.descripcion ? "error-descripcion" : undefined}
                />
                {errores.descripcion && (
                    <p className="formulario__error" id="error-descripcion" role="alert">
                        {errores.descripcion}
                    </p>
                )}
            </div>

            <div className="formulario__campo">
                <label htmlFor="precio">Precio (ARS)</label>
                <input
                    id="precio"
                    name="precio"
                    type="number"
                    min="1"
                    step="1"
                    value={valores.precio}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.precio)}
                    aria-describedby={errores.precio ? "error-precio" : undefined}
                />
                {errores.precio && (
                    <p className="formulario__error" id="error-precio" role="alert">
                        {errores.precio}
                    </p>
                )}
            </div>

            <div className="formulario__campo">
                <label htmlFor="imagen">Imagen (URL o nombre de archivo)</label>
                <input
                    id="imagen"
                    name="imagen"
                    type="text"
                    value={valores.imagen}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.imagen)}
                    aria-describedby={errores.imagen ? "error-imagen" : undefined}
                />
                {errores.imagen && (
                    <p className="formulario__error" id="error-imagen" role="alert">
                        {errores.imagen}
                    </p>
                )}
            </div>

            <div className="formulario__campo">
                <label htmlFor="categoria">Categoría</label>
                <input
                    id="categoria"
                    name="categoria"
                    type="text"
                    value={valores.categoria}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.categoria)}
                    aria-describedby={errores.categoria ? "error-categoria" : undefined}
                />
                {errores.categoria && (
                    <p className="formulario__error" id="error-categoria" role="alert">
                        {errores.categoria}
                    </p>
                )}
            </div>

            <button type="submit" className="boton boton--principal" disabled={enviando}>
                {enviando ? "Guardando..." : textoBoton}
            </button>
        </form>
    );
}

export default ProductForm;
