import Modal from "./Modal.jsx";

function ConfirmDialog({ titulo = "Confirmar acción", mensaje, onConfirmar, onCancelar, confirmando = false }) {
    return (
        <Modal titulo={titulo} onClose={onCancelar}>
            <p className="confirmar__mensaje">{mensaje}</p>
            <div className="confirmar__acciones">
                <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={confirmando}>
                    Cancelar
                </button>
                <button type="button" className="boton boton--peligro" onClick={onConfirmar} disabled={confirmando}>
                    {confirmando ? "Eliminando..." : "Eliminar"}
                </button>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;
