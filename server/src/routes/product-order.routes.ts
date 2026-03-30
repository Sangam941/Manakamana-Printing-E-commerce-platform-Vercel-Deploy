import { Router } from "express";
import * as orderController from "../controller/product-order.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

// CLIENT ROUTES
router.post(
  "/",
  protect,
  restrictTo("CLIENT"),
  orderController.createProductOrder
);

router.get(
  "/",
  protect,
  restrictTo("CLIENT"),
  orderController.getMyOrders
);

router.get(
  "/:orderId",
  protect,
  restrictTo("CLIENT"),
  orderController.getOrderDetails
);

export default router;
