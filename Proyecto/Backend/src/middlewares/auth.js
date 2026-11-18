import authService from "../services/auth.service.js";
import { Messages } from "../enums/Messages.js";
import { Roles } from "../enums/Roles.js";
import { UnauthorizedError, ForbiddenError } from "../exceptions/AppError.js";

// Exige un token válido y deja el usuario autenticado en req.usuario
export const autenticar = (req, res, next) => {
    const encabezado = req.headers.authorization ?? "";
    const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : null;
    const usuario = token ? authService.usuarioPorToken(token) : null;

    if (!usuario) {
        return next(new UnauthorizedError(Messages.UNAUTHORIZED));
    }

    req.usuario = usuario;
    req.token = token;
    next();
};

// Exige que el usuario autenticado sea administrador
export const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== Roles.ADMINISTRADOR) {
        return next(new ForbiddenError(Messages.FORBIDDEN));
    }
    next();
};
