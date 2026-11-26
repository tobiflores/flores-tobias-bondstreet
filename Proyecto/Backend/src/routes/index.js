import { Router } from "express";
import productoRoutes from "./producto.routes.js";
import authRoutes from "./auth.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import stockRoutes from "./stock.routes.js";
import cuponRoutes from "./cupon.routes.js";

const router = Router();

router.use("/productos", productoRoutes);
router.use("/auth", authRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/stock", stockRoutes);
router.use("/cupones", cuponRoutes);

export default router;
