import { Router } from "express";
import pedidoController from "../controllers/pedido.controller.js";
import { autenticar } from "../middlewares/auth.js";

const router = Router();

router.post("/", autenticar, (req, res, next) => pedidoController.crear(req, res, next));
router.get("/", autenticar, (req, res, next) => pedidoController.obtenerPropios(req, res, next));

export default router;
