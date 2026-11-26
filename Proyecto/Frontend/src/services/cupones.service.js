const API_URL = "http://localhost:3000/api/cupones";

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

const encabezadosAuth = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
});

export function validarCupon(codigo, token) {
    return request(`${API_URL}/validar`, {
        method: "POST",
        headers: encabezadosAuth(token),
        body: JSON.stringify({ codigo })
    });
}

export function listarCupones(token) {
    return request(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export function crearCupon(datos, token) {
    return request(API_URL, {
        method: "POST",
        headers: encabezadosAuth(token),
        body: JSON.stringify(datos)
    });
}

export function alternarCupon(id, token) {
    return request(`${API_URL}/${id}/alternar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
    });
}
