import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { autenticar } from "../middlewares/auth.js";

const router = Router();

router.post("/registro", (req, res, next) => authController.registrar(req, res, next));
router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/logout", autenticar, (req, res, next) => authController.logout(req, res, next));

export default router;
