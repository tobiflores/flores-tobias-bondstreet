function Loader({ mensaje = "Cargando..." }) {
    return (
        <div className="loader" role="status" aria-live="polite">
            <span className="loader__spinner" aria-hidden="true"></span>
            <p>{mensaje}</p>
        </div>
    );
}

export default Loader;
