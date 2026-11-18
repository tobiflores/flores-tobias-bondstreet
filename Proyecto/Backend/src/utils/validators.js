export const esTextoValido = (valor) =>
    typeof valor === "string" && valor.trim().length > 0;

export const esNumeroPositivo = (valor) =>
    typeof valor === "number" && !Number.isNaN(valor) && valor > 0;

export const parsearId = (valor) => {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
};

export const esEmailValido = (valor) =>
    typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());

// Mínimo 8 caracteres y al menos un caracter especial
export const esPasswordValida = (valor) =>
    typeof valor === "string" && valor.length >= 8 && /[^A-Za-z0-9]/.test(valor);

export const esCantidadValida = (valor) =>
    Number.isInteger(valor) && valor > 0;
