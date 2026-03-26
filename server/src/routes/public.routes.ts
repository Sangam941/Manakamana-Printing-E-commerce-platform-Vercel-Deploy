import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import * as adminController from "../controller/admin.controller";
import * as serviceController from "../controller/printing-service.controller";
import * as categoryController from "../controller/order-category.controller";
import * as productController from "../controller/order-product.controller";
import { createRegistrationRequestSchema } from "../validators/registration.validator";

const router = Router();

// CLIENT SELF-REGISTRATION
router.post(
  "/register-request",
  validate(createRegistrationRequestSchema),
  adminController.createRegistrationRequest
);

// PRINTING SERVICES
router.get("/services", serviceController.getServices);
router.get("/services/:serviceId", serviceController.getServiceById);

// ORDER CATALOG (Public/Browsing)
router.get("/order-categories", categoryController.getCategories);
router.get("/order-categories/:categoryId/products", productController.getProductsByCategory);
router.get("/order-products/:productId", productController.getProductById);

export default router;
