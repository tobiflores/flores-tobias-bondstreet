import { Router } from "express";
import pedidoController from "../controllers/pedido.controller.js";
import { autenticar, soloAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/todos", autenticar, soloAdmin, (req, res, next) => pedidoController.obtenerTodos(req, res, next));
router.get("/", autenticar, (req, res, next) => pedidoController.obtenerPropios(req, res, next));
router.post("/", autenticar, (req, res, next) => pedidoController.crear(req, res, next));
router.put("/:id/cancelar", autenticar, (req, res, next) => pedidoController.cancelar(req, res, next));
router.put("/:id/estado", autenticar, soloAdmin, (req, res, next) => pedidoController.avanzarEstado(req, res, next));

export default router;
