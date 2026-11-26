const API_URL = "http://localhost:3000/api/pedidos";

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

export function crearPedido(datos, token) {
    return request(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
}

export function obtenerMisPedidos(token) {
    return request(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function cancelarPedido(id, token) {
    return request(`${API_URL}/${id}/cancelar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function obtenerTodosPedidos(token) {
    return request(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function avanzarEstadoPedido(id, token) {
    return request(`${API_URL}/${id}/estado`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
    });
}
