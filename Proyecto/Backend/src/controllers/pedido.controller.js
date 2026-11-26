import pedidoService from "../services/pedido.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class PedidoController {
    crear(req, res, next) {
        try {
            const resultado = pedidoService.crear(req.usuario, req.body ?? {});
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

    obtenerTodos(req, res, next) {
        try {
            const pedidos = pedidoService.obtenerTodos();
            return ApiResponse.success(res, pedidos);
        } catch (error) {
            next(error);
        }
    }

    cancelar(req, res, next) {
        try {
            const pedido = pedidoService.cancelar(req.usuario, req.params.id);
            return ApiResponse.success(res, pedido);
        } catch (error) {
            next(error);
        }
    }

    avanzarEstado(req, res, next) {
        try {
            const pedido = pedidoService.avanzarEstado(req.params.id);
            return ApiResponse.success(res, pedido);
        } catch (error) {
            next(error);
        }
    }
}

export default new PedidoController();
