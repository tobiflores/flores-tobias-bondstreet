const API_URL = "http://localhost:3000/api/productos";

async function procesarRespuesta(response) {
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

async function request(url, opciones = {}) {
    let response;
    try {
        response = await fetch(url, opciones);
    } catch {
        throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
    }
    return procesarRespuesta(response);
}

export function obtenerProductos() {
    return request(API_URL);
}

export function obtenerProductoPorId(id) {
    return request(`${API_URL}/${id}`);
}

const encabezadosAuth = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
});

export function crearProducto(producto, token) {
    return request(API_URL, {
        method: "POST",
        headers: encabezadosAuth(token),
        body: JSON.stringify(producto)
    });
}

export function actualizarProducto(id, producto, token) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: encabezadosAuth(token),
        body: JSON.stringify(producto)
    });
}

export function eliminarProducto(id, token) {
    return request(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
}
