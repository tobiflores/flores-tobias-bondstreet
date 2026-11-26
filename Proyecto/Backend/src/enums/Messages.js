export const Messages = Object.freeze({
    PRODUCT_NOT_FOUND: "El producto no existe.",
    USER_NOT_FOUND: "El usuario no existe.",
    INVALID_DATA: "Los datos enviados son inválidos.",
    DUPLICATED_RESOURCE: "El recurso ya existe.",
    INVALID_ID: "El id proporcionado es inválido.",
    ROUTE_NOT_FOUND: "La ruta solicitada no existe.",
    INTERNAL_ERROR: "Ocurrió un error interno en el servidor.",
    INVALID_EMAIL: "El formato del email es inválido.",
    WEAK_PASSWORD: "La contraseña debe tener al menos 8 caracteres y un caracter especial.",
    DUPLICATED_EMAIL: "Ya existe un usuario registrado con ese email.",
    INVALID_CREDENTIALS: "Email o contraseña incorrectos.",
    UNAUTHORIZED: "Tenés que iniciar sesión para realizar esta acción.",
    FORBIDDEN: "No tenés permisos para realizar esta acción.",
    EMPTY_ORDER: "El pedido debe contener al menos un producto.",
    ADDRESS_REQUIRED: "La dirección de entrega es obligatoria.",
    VARIANT_NOT_FOUND: "El talle/color seleccionado no existe para ese producto.",
    INSUFFICIENT_STOCK: "No hay stock suficiente para el talle y color elegidos.",
    DUPLICATED_VARIANT: "Ya existe esa combinación de talle y color para el producto.",
    STOCK_NOT_FOUND: "La variante de stock no existe.",
    ORDER_NOT_FOUND: "El pedido no existe.",
    ORDER_NOT_CANCELABLE: "El pedido no se puede cancelar en su estado actual.",
    INVALID_STATE_TRANSITION: "El pedido no puede pasar a ese estado.",
    CUPON_INVALID: "El cupón no existe, está inactivo o ya venció.",
    DUPLICATED_CUPON: "Ya existe un cupón con ese código."
});

export default Messages;
