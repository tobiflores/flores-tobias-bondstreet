import authService from "../services/auth.service.js";
import ApiResponse from "../responses/ApiResponse.js";

class AuthController {
    registrar(req, res, next) {
        try {
            const sesion = authService.registrar(req.body ?? {});
            return ApiResponse.success(res, sesion, 201);
        } catch (error) {
            next(error);
        }
    }

    login(req, res, next) {
        try {
            const sesion = authService.login(req.body ?? {});
            return ApiResponse.success(res, sesion);
        } catch (error) {
            next(error);
        }
    }

    logout(req, res, next) {
        try {
            authService.cerrarSesion(req.token);
            return ApiResponse.success(res, null);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
