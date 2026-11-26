// Helpers del flujo de estados del pedido (espejo de las reglas del backend)
export const SIGUIENTE_ESTADO = {
    Confirmado: "En preparación",
    "En preparación": "Enviado",
    Enviado: "Entregado"
};

export const esCancelable = (estado) => estado === "Confirmado" || estado === "En preparación";

export const claseEstado = (estado) =>
    estado
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
