export const esTextoValido = (valor) =>
    typeof valor === "string" && valor.trim().length > 0;

export const esNumeroPositivo = (valor) =>
    typeof valor === "number" && !Number.isNaN(valor) && valor > 0;

export const parsearId = (valor) => {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
};
