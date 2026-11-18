import productoService from "../services/producto.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class ProductoController {
    obtenerTodos(req, res, next) {
        try {
            const productos = productoService.obtenerTodos();
            return ApiResponse.success(res, productos);
        } catch (error) {
            next(error);
        }
    }

    obtenerPorId(req, res, next) {
        try {
            const producto = productoService.obtenerPorId(req.params.id);
            return ApiResponse.success(res, producto);
        } catch (error) {
            next(error);
        }
    }

    crear(req, res, next) {
        try {
            const producto = productoService.crear(req.body);
            return ApiResponse.success(res, producto, 201);
        } catch (error) {
            next(error);
        }
    }

    actualizar(req, res, next) {
        try {
            const producto = productoService.actualizar(req.params.id, req.body);
            return ApiResponse.success(res, producto);
        } catch (error) {
            next(error);
        }
    }

    eliminar(req, res, next) {
        try {
            const producto = productoService.eliminar(req.params.id);
            return ApiResponse.success(res, producto);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductoController();
