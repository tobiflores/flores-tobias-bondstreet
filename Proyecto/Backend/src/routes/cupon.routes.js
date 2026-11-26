import { Router } from "express";
import cuponController from "../controllers/cupon.controller.js";
import { autenticar, soloAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/validar", autenticar, (req, res, next) => cuponController.validar(req, res, next));
router.get("/", autenticar, soloAdmin, (req, res, next) => cuponController.listar(req, res, next));
router.post("/", autenticar, soloAdmin, (req, res, next) => cuponController.crear(req, res, next));
router.put("/:id/alternar", autenticar, soloAdmin, (req, res, next) => cuponController.alternar(req, res, next));

export default router;
