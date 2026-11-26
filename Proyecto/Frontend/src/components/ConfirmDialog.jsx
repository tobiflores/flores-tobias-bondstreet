import Modal from "./Modal.jsx";

function ConfirmDialog({
    titulo = "Confirmar acción",
    mensaje,
    onConfirmar,
    onCancelar,
    confirmando = false,
    textoConfirmar = "Eliminar",
    textoProcesando = "Eliminando...",
    textoVolver = "Cancelar"
}) {
    return (
        <Modal titulo={titulo} onClose={onCancelar}>
            <p className="confirmar__mensaje">{mensaje}</p>
            <div className="confirmar__acciones">
                <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={confirmando}>
                    {textoVolver}
                </button>
                <button type="button" className="boton boton--peligro" onClick={onConfirmar} disabled={confirmando}>
                    {confirmando ? textoProcesando : textoConfirmar}
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;
