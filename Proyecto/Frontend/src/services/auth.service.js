const API_URL = "http://localhost:3000/api/auth";

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

export function registrarse(datos) {
    return request(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
}

export function iniciarSesion(credenciales) {
    return request(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciales)
    });
}

export function cerrarSesion(token) {
    return request(`${API_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
    });
}
