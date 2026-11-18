import { useEffect, useState } from "react";
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../services/productos.service.js";
import { useNotificaciones } from "../components/Notifications.jsx";
import { useAuth } from "../components/AuthContext.jsx";
import { formatearPrecio } from "../utils/formato.js";
import ProductForm from "../components/ProductForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Modal from "../components/Modal.jsx";
import Loader from "../components/Loader.jsx";

function AdminPage() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [creando, setCreando] = useState(false);
    const [editando, setEditando] = useState(null);
    const [eliminando, setEliminando] = useState(null);
    const notificaciones = useNotificaciones();
    const { token } = useAuth();

    const cargar = async () => {
        try {
            setProductos(await obtenerProductos());
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manejarCrear = async (datos) => {
        setEnviando(true);
        try {
            await crearProducto(datos, token);
            notificaciones.exito("Producto creado correctamente.");
            setCreando(false);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    const manejarActualizar = async (datos) => {
        setEnviando(true);
        try {
            await actualizarProducto(editando.id, datos, token);
            notificaciones.exito("Producto actualizado correctamente.");
            setEditando(null);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    const manejarEliminar = async () => {
        setEnviando(true);
        try {
            await eliminarProducto(eliminando.id, token);
            notificaciones.exito("Producto eliminado correctamente.");
            setEliminando(null);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <section className="seccion" aria-labelledby="titulo-admin">
            <div className="admin__encabezado">
                <h1 id="titulo-admin" className="seccion__titulo">
                    Administración de productos
                </h1>
                <button type="button" className="boton boton--principal" onClick={() => setCreando(true)}>
                    + Nuevo producto
                </button>
            </div>

            {cargando ? (
                <Loader mensaje="Cargando productos..." />
            ) : productos.length === 0 ? (
                <p className="seccion__vacio">No hay productos cargados. ¡Creá el primero!</p>
            ) : (
                <div className="tabla__contenedor">
                    <table className="tabla">
                        <caption className="visualmente-oculto">Listado de productos del catálogo</caption>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Categoría</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.categoria}</td>
                                    <td>{formatearPrecio(producto.precio)}</td>
                                    <td>
                                        <div className="tabla__acciones">
                                            <button
                                                type="button"
                                                className="boton boton--secundario boton--chico"
                                                onClick={() => setEditando(producto)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                className="boton boton--peligro boton--chico"
                                                onClick={() => setEliminando(producto)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {creando && (
                <Modal titulo="Nuevo producto" onClose={() => setCreando(false)}>
                    <ProductForm onSubmit={manejarCrear} enviando={enviando} textoBoton="Crear producto" />
                </Modal>
            )}

            {editando && (
                <Modal titulo={`Editar: ${editando.nombre}`} onClose={() => setEditando(null)}>
                    <ProductForm
                        valoresIniciales={editando}
                        onSubmit={manejarActualizar}
                        enviando={enviando}
                        textoBoton="Guardar cambios"
                    />
                </Modal>
            )}

            {eliminando && (
                <ConfirmDialog
                    titulo="Eliminar producto"
                    mensaje={`¿Estás seguro de que querés eliminar "${eliminando.nombre}"? Esta acción no se puede deshacer.`}
                    onConfirmar={manejarEliminar}
                    onCancelar={() => setEliminando(null)}
                    confirmando={enviando}
                />
            )}
        </section>
    );
}

export default AdminPage;
