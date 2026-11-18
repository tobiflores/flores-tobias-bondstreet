import { Router } from "express";
import productoRoutes from "./producto.routes.js";
import authRoutes from "./auth.routes.js";
import pedidoRoutes from "./pedido.routes.js";

const router = Router();

router.use("/productos", productoRoutes);
router.use("/auth", authRoutes);
router.use("/pedidos", pedidoRoutes);

export default router;
