import crypto from "crypto";
import usuarioRepository from "../repositories/usuario.repository.js";
import { Messages } from "../enums/Messages.js";
import { Roles } from "../enums/Roles.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { esTextoValido, esEmailValido, esPasswordValida } from "../utils/validators.js";

// Sesiones en memoria: token -> idUsuario
const sesiones = new Map();

const sinPassword = (usuario) => ({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
});

class AuthService {
    registrar({ nombre, email, password }) {
        if (!esTextoValido(nombre)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        if (!esEmailValido(email)) {
            throw new BadRequestError(Messages.INVALID_EMAIL);
        }
        if (!esPasswordValida(password)) {
            throw new BadRequestError(Messages.WEAK_PASSWORD);
        }
        if (usuarioRepository.findByEmail(email)) {
            throw new ConflictError(Messages.DUPLICATED_EMAIL);
        }

        const usuario = usuarioRepository.create({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            password,
            rol: Roles.CLIENTE
        });

        return this.#crearSesion(usuario);
    }

    login({ email, password }) {
        if (!esEmailValido(email) || typeof password !== "string") {
            throw new BadRequestError(Messages.INVALID_CREDENTIALS);
        }

        const usuario = usuarioRepository.findByEmail(email.trim());
        if (!usuario || usuario.password !== password) {
            throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
        }

        return this.#crearSesion(usuario);
    }

    usuarioPorToken(token) {
        const idUsuario = sesiones.get(token);
        if (!idUsuario) return null;
        return usuarioRepository.findById(idUsuario);
    }

    cerrarSesion(token) {
        sesiones.delete(token);
    }

    #crearSesion(usuario) {
        const token = crypto.randomUUID();
        sesiones.set(token, usuario.id);
        return { token, usuario: sinPassword(usuario) };
    }
}

export default new AuthService();
