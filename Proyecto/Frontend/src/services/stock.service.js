const API_PRODUCTOS = "http://localhost:3000/api/productos";
const API_STOCK = "http://localhost:3000/api/stock";

async function request(url, opciones = {}) {
    let response;
    try {
        response = await fetch(url, opciones);
    } catch {
        throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
    }

    let body = null;
    try {
        body = await response.json();
    } catch {
        // respuesta sin cuerpo JSON
    }

    if (!response.ok || !body || body.success === false) {
        throw new Error(body?.message ?? "Error inesperado al comunicarse con el servidor.");
    }

    return body.data;
}

export function obtenerStock(idProducto) {
    return request(`${API_PRODUCTOS}/${idProducto}/stock`);
}

export function agregarVariante(idProducto, datos, token) {
    return request(`${API_PRODUCTOS}/${idProducto}/stock`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
}

export function actualizarCantidadStock(idVariante, cantidad, token) {
    return request(`${API_STOCK}/${idVariante}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad })
    });
}
