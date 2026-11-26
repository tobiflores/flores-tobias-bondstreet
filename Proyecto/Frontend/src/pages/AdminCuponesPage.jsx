import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useNotificaciones } from "../components/Notifications.jsx";
import { listarCupones, crearCupon, alternarCupon } from "../services/cupones.service.js";
import AdminNav from "../components/AdminNav.jsx";
import Loader from "../components/Loader.jsx";

const VALORES_INICIALES = { codigo: "", porcentajeDescuento: "", fechaVencimiento: "" };

function AdminCuponesPage() {
    const [cupones, setCupones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [valores, setValores] = useState(VALORES_INICIALES);
    const [errores, setErrores] = useState({});
    const { token } = useAuth();
    const notificaciones = useNotificaciones();

    const cargar = async () => {
        try {
            setCupones(await listarCupones(token));
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

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setValores((previos) => ({ ...previos, [name]: value }));
    };

    const validar = () => {
        const nuevosErrores = {};
        if (!valores.codigo.trim()) {
            nuevosErrores.codigo = "El código es obligatorio.";
        }
        const porcentaje = Number(valores.porcentajeDescuento);
        if (!Number.isInteger(porcentaje) || porcentaje < 1 || porcentaje > 100) {
            nuevosErrores.porcentajeDescuento = "Ingresá un porcentaje entero entre 1 y 100.";
        }
        if (!valores.fechaVencimiento) {
            nuevosErrores.fechaVencimiento = "La fecha de vencimiento es obligatoria.";
        }
        return nuevosErrores;
    };

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        const nuevosErrores = validar();
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        setEnviando(true);
        try {
            const cupon = await crearCupon(
                {
                    codigo: valores.codigo.trim().toUpperCase(),
                    porcentajeDescuento: Number(valores.porcentajeDescuento),
                    fechaVencimiento: valores.fechaVencimiento
                },
                token
            );
            notificaciones.exito(`Cupón ${cupon.codigo} creado correctamente.`);
            setValores(VALORES_INICIALES);
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        } finally {
            setEnviando(false);
        }
    };

    const manejarAlternar = async (cupon) => {
        try {
            const actualizado = await alternarCupon(cupon.id, token);
            notificaciones.exito(
                `Cupón ${actualizado.codigo} ${actualizado.activo ? "activado" : "desactivado"}.`
            );
            await cargar();
        } catch (error) {
            notificaciones.error(error.message);
        }
    };

    return (
        <section className="seccion" aria-labelledby="titulo-admin-cupones">
            <h1 id="titulo-admin-cupones" className="seccion__titulo">
                Gestión de cupones
            </h1>
            <AdminNav />

            <form className="cupon-form" onSubmit={manejarEnvio} noValidate>
                <div className="formulario__campo">
                    <label htmlFor="codigo">Código</label>
                    <input
                        id="codigo"
                        name="codigo"
                        type="text"
                        placeholder="Ej: FINDE25"
                        value={valores.codigo}
                        onChange={manejarCambio}
                        aria-invalid={Boolean(errores.codigo)}
                        aria-describedby={errores.codigo ? "error-codigo" : undefined}
                    />
                    {errores.codigo && (
                        <p className="formulario__error" id="error-codigo" role="alert">
                            {errores.codigo}
                        </p>
                    )}
                </div>
                <div className="formulario__campo">
                    <label htmlFor="porcentajeDescuento">Descuento (%)</label>
                    <input
                        id="porcentajeDescuento"
                        name="porcentajeDescuento"
                        type="number"
                        min="1"
                        max="100"
                        value={valores.porcentajeDescuento}
                        onChange={manejarCambio}
                        aria-invalid={Boolean(errores.porcentajeDescuento)}
                        aria-describedby={errores.porcentajeDescuento ? "error-porcentaje" : undefined}
                    />
                    {errores.porcentajeDescuento && (
                        <p className="formulario__error" id="error-porcentaje" role="alert">
                            {errores.porcentajeDescuento}
                        </p>
                    )}
                </div>
                <div className="formulario__campo">
                    <label htmlFor="fechaVencimiento">Vence el</label>
                    <input
                        id="fechaVencimiento"
                        name="fechaVencimiento"
                        type="date"
                        value={valores.fechaVencimiento}
                        onChange={manejarCambio}
                        aria-invalid={Boolean(errores.fechaVencimiento)}
                        aria-describedby={errores.fechaVencimiento ? "error-fecha" : undefined}
                    />
                    {errores.fechaVencimiento && (
                        <p className="formulario__error" id="error-fecha" role="alert">
                            {errores.fechaVencimiento}
                        </p>
                    )}
                </div>
                <button type="submit" className="boton boton--principal" disabled={enviando}>
                    {enviando ? "Creando..." : "Crear cupón"}
                </button>
            </form>

            {cargando ? (
                <Loader mensaje="Cargando cupones..." />
            ) : (
                <div className="tabla__contenedor">
                    <table className="tabla">
                        <caption className="visualmente-oculto">Listado de cupones de descuento</caption>
                        <thead>
                            <tr>
                                <th scope="col">Código</th>
                                <th scope="col">Descuento</th>
                                <th scope="col">Vencimiento</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map((cupon) => {
                                const vencido = new Date(cupon.fechaVencimiento) < new Date();
                                const etiqueta = vencido ? "Vencido" : cupon.activo ? "Activo" : "Inactivo";
                                const usable = cupon.activo && !vencido;

                                return (
                                    <tr key={cupon.id}>
                                        <td>{cupon.codigo}</td>
                                        <td>{cupon.porcentajeDescuento}%</td>
                                        <td>{cupon.fechaVencimiento}</td>
                                        <td>
                                            <span className={`estado ${usable ? "estado--confirmado" : "estado--cancelado"}`}>
                                                {etiqueta}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="boton boton--secundario boton--chico"
                                                onClick={() => manejarAlternar(cupon)}
                                            >
                                                {cupon.activo ? "Desactivar" : "Activar"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AdminCuponesPage;
