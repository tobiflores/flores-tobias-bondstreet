const formateador = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

export function formatearPrecio(valor) {
    return formateador.format(valor);
}

export function formatearFecha(iso) {
    return new Intl.DateTimeFormat("es-AR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(iso));
}
