import stockService from "../services/stock.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class StockController {
    obtenerPorProducto(req, res, next) {
        try {
            const variantes = stockService.obtenerPorProducto(req.params.id);
            return ApiResponse.success(res, variantes);
        } catch (error) {
            next(error);
        }
    }

    agregarVariante(req, res, next) {
        try {
            const variante = stockService.agregarVariante(req.params.id, req.body ?? {});
            return ApiResponse.success(res, variante, 201);
        } catch (error) {
            next(error);
        }
    }

    actualizarCantidad(req, res, next) {
        try {
            const variante = stockService.actualizarCantidad(req.params.id, req.body?.cantidad);
            return ApiResponse.success(res, variante);
        } catch (error) {
            next(error);
        }
    }
}

export default new StockController();
