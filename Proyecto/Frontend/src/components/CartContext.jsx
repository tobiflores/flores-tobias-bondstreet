import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
const CLAVE_CARRITO = "bond_carrito";

const leerCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? [];
    } catch {
        return [];
    }
};

const claveItem = (idProducto, talle, color) => `${idProducto}|${talle}|${color}`;

export function CartProvider({ children }) {
    const [items, setItems] = useState(leerCarrito);

    const persistir = useCallback((nuevosItems) => {
        setItems(nuevosItems);
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevosItems));
    }, []);

    const agregar = useCallback(
        (producto, talle, color, cantidad) => {
            const clave = claveItem(producto.id, talle, color);
            const existente = items.find((item) => item.clave === clave);

            if (existente) {
                persistir(
                    items.map((item) =>
                        item.clave === clave ? { ...item, cantidad: item.cantidad + cantidad } : item
                    )
                );
            } else {
                persistir([
                    ...items,
                    {
                        clave,
                        idProducto: producto.id,
                        nombre: producto.nombre,
                        precio: producto.precio,
                        categoria: producto.categoria,
                        talle,
                        color,
                        cantidad
                    }
                ]);
            }
        },
        [items, persistir]
    );

    const cambiarCantidad = useCallback(
        (clave, cantidad) => {
            if (cantidad < 1) return;
            persistir(items.map((item) => (item.clave === clave ? { ...item, cantidad } : item)));
        },
        [items, persistir]
    );

    const quitar = useCallback(
        (clave) => {
            persistir(items.filter((item) => item.clave !== clave));
        },
        [items, persistir]
    );

    const vaciar = useCallback(() => persistir([]), [persistir]);

    const total = useMemo(
        () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
        [items]
    );

    const cantidadTotal = useMemo(
        () => items.reduce((suma, item) => suma + item.cantidad, 0),
        [items]
    );

    const valor = { items, agregar, cambiarCantidad, quitar, vaciar, total, cantidadTotal };

    return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCarrito() {
    const contexto = useContext(CartContext);
    if (!contexto) {
        throw new Error("useCarrito debe usarse dentro de CartProvider.");
    }
    return contexto;
}
