import Usuario from "../models/Usuario.js";
import { Roles } from "../enums/Roles.js";

// Persistencia temporal en memoria (incluye un administrador de prueba)
const usuarios = [
    new Usuario(1, "Admin Bond", "admin@bondstreet.com.ar", "Admin#1234", Roles.ADMINISTRADOR)
];

let siguienteId = 2;

class UsuarioRepository {
    findAll() {
        return usuarios;
    }

    findById(id) {
        return usuarios.find((usuario) => usuario.id === id) ?? null;
    }

    findByEmail(email) {
        return usuarios.find(
            (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
        ) ?? null;
    }

    create({ nombre, email, password, rol }) {
        const usuario = new Usuario(siguienteId++, nombre, email, password, rol);
        usuarios.push(usuario);
        return usuario;
    }
}

export default new UsuarioRepository();
