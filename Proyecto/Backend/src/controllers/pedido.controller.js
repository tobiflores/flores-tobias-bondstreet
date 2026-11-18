import pedidoService from "../services/pedido.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class PedidoController {
    crear(req, res, next) {
        try {
            const resultado = pedidoService.crear(req.usuario, req.body?.items);
            return ApiResponse.success(res, resultado, 201);
        } catch (error) {
            next(error);
        }
    }

    obtenerPropios(req, res, next) {
        try {
            const pedidos = pedidoService.obtenerPropios(req.usuario);
            return ApiResponse.success(res, pedidos);
        } catch (error) {
            next(error);
        }
    }
}

export default new PedidoController();
