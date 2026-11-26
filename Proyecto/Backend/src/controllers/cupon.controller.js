import cuponService from "../services/cupon.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class CuponController {
    listar(req, res, next) {
        try {
            return ApiResponse.success(res, cuponService.listar());
        } catch (error) {
            next(error);
        }
    }

    crear(req, res, next) {
        try {
            const cupon = cuponService.crear(req.body ?? {});
            return ApiResponse.success(res, cupon, 201);
        } catch (error) {
            next(error);
        }
    }

    alternar(req, res, next) {
        try {
            const cupon = cuponService.alternar(req.params.id);
            return ApiResponse.success(res, cupon);
        } catch (error) {
            next(error);
        }
    }

    validar(req, res, next) {
        try {
            const cupon = cuponService.validar(req.body?.codigo);
            return ApiResponse.success(res, cupon);
        } catch (error) {
            next(error);
        }
    }
}

export default new CuponController();
