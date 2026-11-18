import { Router } from "express";
import productoController from "../controllers/producto.controller.js";
import { autenticar, soloAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", (req, res, next) => productoController.obtenerTodos(req, res, next));
router.get("/:id", (req, res, next) => productoController.obtenerPorId(req, res, next));
router.post("/", autenticar, soloAdmin, (req, res, next) => productoController.crear(req, res, next));
router.put("/:id", autenticar, soloAdmin, (req, res, next) => productoController.actualizar(req, res, next));
router.delete("/:id", autenticar, soloAdmin, (req, res, next) => productoController.eliminar(req, res, next));

export default router;
