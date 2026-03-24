import { Router } from "express";
import * as orderController from "../controller/id-card-order.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createIdCardOrderSchema } from "../validators/id-card-order.validator";

const router = Router();

// CLIENT ROUTES
router.post(
  "/",
  protect,
  restrictTo("CLIENT"),
  validate(createIdCardOrderSchema),
  orderController.createIdCardOrder
);

router.get(
  "/",
  protect,
  restrictTo("CLIENT"),
  orderController.getMyIdCardOrders
);

router.get(
  "/:orderId",
  protect,
  restrictTo("CLIENT"),
  orderController.getMyIdCardOrderById
);

export default router;
