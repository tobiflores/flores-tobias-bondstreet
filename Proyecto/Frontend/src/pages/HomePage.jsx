import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos } from "../services/productos.service.js";
import { useNotificaciones } from "../components/Notifications.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductDetail from "../components/ProductDetail.jsx";
import AddToCartForm from "../components/AddToCartForm.jsx";
import Marquee from "../components/Marquee.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";

function HomePage() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
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

    const destacados = useMemo(() => productos.slice(0, 4), [productos]);
    const categorias = useMemo(
        () => [...new Set(productos.map((producto) => producto.categoria))],
        [productos]
    );

    return (
        <>
            <section className="hero" aria-label="Bienvenida">
                <p className="hero__etiqueta">Av. Santa Fe 1670 — CABA</p>
                <h1 className="hero__titulo">Bond Street</h1>
                <p className="hero__texto">
                    Tres pisos tapizados de graffitis donde conviven <strong>tattoo, piercing, vinilos
                    inéditos, cómics, stickers y diseño independiente</strong>. Lo que no vas a encontrar
                    en ningún shopping, lo encontrás acá.
                </p>
                <div className="hero__acciones">
                    <Link to="/catalogo" className="boton boton--principal">
                        Ver catálogo
                    </Link>
                    <a href="#titulo-sobre" className="boton boton--secundario">
                        Conocé la galería
                    </a>
                </div>
                <span className="hero__sticker hero__sticker--1" aria-hidden="true">
                    3 pisos
                </span>
                <span className="hero__sticker hero__sticker--2" aria-hidden="true">
                    Cultura alternativa
                </span>
            </section>

            <Marquee
                items={[
                    "Tattoo",
                    "Piercing",
                    "Vinilos",
                    "Cómics",
                    "Stickers",
                    "Diseño independiente",
                    "Skate",
                    "Ropa gótica"
                ]}
            />

            <section className="seccion" aria-labelledby="titulo-categorias">
                <h2 id="titulo-categorias" className="seccion__titulo">
                    Qué vas a encontrar
                </h2>
                {cargando ? (
                    <Loader mensaje="Abriendo la persiana..." />
                ) : (
                    <ul className="categorias" style={{ listStyle: "none" }}>
                        {categorias.map((categoria) => (
                            <li key={categoria} className="categorias__chip">
                                {categoria}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="seccion" aria-labelledby="titulo-destacados">
                <h2 id="titulo-destacados" className="seccion__titulo">
                    Destacados de la semana
                </h2>
                {cargando ? (
                    <Loader mensaje="Cargando destacados..." />
                ) : destacados.length === 0 ? (
                    <p className="seccion__vacio">Todavía no hay productos para mostrar.</p>
                ) : (
                    <div className="grilla grilla--destacados">
                        {destacados.map((producto) => (
                            <ProductCard
                                key={producto.id}
                                producto={producto}
                                acciones={
                                    <button
                                        type="button"
                                        className="boton boton--secundario boton--chico"
                                        onClick={() => setSeleccionado(producto)}
                                    >
                                        Más info
                                    </button>
                                }
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="seccion sobre" aria-labelledby="titulo-sobre">
                <h2 id="titulo-sobre" className="seccion__titulo">
                    Sobre nosotros
                </h2>
                <div className="sobre__contenido">
                    <div className="sobre__imagen" role="img" aria-label="Cartel ilustrado de la Galería Bond Street">
                        <span aria-hidden="true">BOND STREET</span>
                        <small aria-hidden="true">EST. SANTA FE 1670</small>
                    </div>
                    <p className="sobre__texto">
                        La <strong>Galería Bond Street</strong> es un centro comercial de tres pisos en Av.
                        Santa Fe 1670 que desde hace décadas es <strong>el templo de la cultura alternativa
                        porteña</strong>. En sus pasillos tapizados de graffitis y stickers conviven estudios
                        de tatuaje con artistas súper reconocidos, locales de piercing, disquerías con material
                        inédito, cómics, diseño independiente, indumentaria gótica y todo para skaters y
                        bikers. Más que una galería: un punto de encuentro. Nuestra tienda online te acerca
                        lo mejor de la Bond, estés donde estés.
                    </p>
                </div>
            </section>

            {seleccionado && (
                <Modal titulo={seleccionado.nombre} onClose={() => setSeleccionado(null)}>
                    <ProductDetail producto={seleccionado} />
                    <AddToCartForm producto={seleccionado} onAgregado={() => setSeleccionado(null)} />
                </Modal>
            )}
        </>
    );
}

export default HomePage;
