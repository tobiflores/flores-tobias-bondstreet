export function validarProducto(valores) {
    const errores = {};

    if (!valores.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio.";
    }

    if (!valores.descripcion.trim()) {
        errores.descripcion = "La descripción es obligatoria.";
    }

    const precio = Number(valores.precio);
    if (valores.precio === "" || Number.isNaN(precio) || precio <= 0) {
        errores.precio = "El precio debe ser un número mayor a cero.";
    }

    if (!valores.imagen.trim()) {
        errores.imagen = "La imagen es obligatoria.";
    }

    if (!valores.categoria.trim()) {
        errores.categoria = "La categoría es obligatoria.";
    }

    return errores;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarRegistro(valores) {
    const errores = {};

    if (!valores.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio.";
    }

    if (!EMAIL_REGEX.test(valores.email.trim())) {
        errores.email = "Ingresá un email válido.";
    }

    if (valores.password.length < 8 || !/[^A-Za-z0-9]/.test(valores.password)) {
        errores.password = "Mínimo 8 caracteres y al menos un caracter especial.";
    }

    return errores;
}

export function validarLogin(valores) {
    const errores = {};

    if (!EMAIL_REGEX.test(valores.email.trim())) {
        errores.email = "Ingresá un email válido.";
    }

    if (!valores.password) {
        errores.password = "La contraseña es obligatoria.";
    }

    return errores;
}
