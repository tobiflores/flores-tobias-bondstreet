import { useEffect, useMemo, useState } from "react";
import { obtenerProductos } from "../services/productos.service.js";
import { useNotificaciones } from "../components/Notifications.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductDetail from "../components/ProductDetail.jsx";
import AddToCartForm from "../components/AddToCartForm.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";

function CatalogPage() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [seleccionado, setSeleccionado] = useState(null);
    const notificaciones = useNotificaciones();

    useEffect(() => {
        const cargar = async () => {
            try {
                setProductos(await obtenerProductos());
            } catch (error) {
                notificaciones.error(error.message);
            } finally {
                setCargando(false);
            }
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtrados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();
        if (!termino) return productos;
        return productos.filter(
            (producto) =>
                producto.nombre.toLowerCase().includes(termino) ||
                producto.categoria.toLowerCase().includes(termino)
        );
    }, [productos, busqueda]);

    return (
        <section className="seccion" aria-labelledby="titulo-catalogo">
            <h1 id="titulo-catalogo" className="seccion__titulo">
                Catálogo
            </h1>

            <div className="buscador">
                <label htmlFor="busqueda">Buscar por nombre o categoría</label>
                <input
                    id="busqueda"
                    type="search"
                    placeholder="Ej: stickers, tattoo, vinilos..."
                    value={busqueda}
                    onChange={(evento) => setBusqueda(evento.target.value)}
                />
            </div>

            {cargando ? (
                <Loader mensaje="Cargando catálogo..." />
            ) : filtrados.length === 0 ? (
                <p className="seccion__vacio">No se encontraron productos.</p>
            ) : (
                <div className="grilla">
                    {filtrados.map((producto) => (
                        <ProductCard
                            key={producto.id}
                            producto={producto}
                            acciones={
                                <button
                                    type="button"
                                    className="boton boton--secundario"
                                    onClick={() => setSeleccionado(producto)}
                                >
                                    Más info
                                </button>
                            }
                        />
                    ))}
                </div>
            )}

            {seleccionado && (
                <Modal titulo={seleccionado.nombre} onClose={() => setSeleccionado(null)}>
                    <ProductDetail producto={seleccionado} />
                    <AddToCartForm producto={seleccionado} onAgregado={() => setSeleccionado(null)} />
                </Modal>
            )}
        </section>
    );
}

export default CatalogPage;
