import { Router } from "express";
import stockController from "../controllers/stock.controller.js";
import { autenticar, soloAdmin } from "../middlewares/auth.js";

const router = Router();

router.put("/:id", autenticar, soloAdmin, (req, res, next) => stockController.actualizarCantidad(req, res, next));

export default router;
