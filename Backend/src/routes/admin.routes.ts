import { Router } from "express";
import * as adminController from "../controller/admin.controller";
import * as authController from "../controller/auth.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";
import * as designSubmissionController from "../controller/design-submission.controller";
import * as approvedDesignController from "../controller/approved-design.controller";
import * as serviceController from "../controller/printing-service.controller";
import * as categoryController from "../controller/order-category.controller";
import * as productController from "../controller/order-product.controller";
import * as idCardOrderController from "../controller/id-card-order.controller";
import { validate } from "../middleware/validate.middleware";
import { 
  createCategorySchema, 
  updateCategorySchema,
  createProductSchema,
  updateProductSchema,
  updateIdCardOrderStatusSchema
} from "../validators/id-card-order.validator";

const router = Router();

// ADMIN AUTH
router.post("/auth/login", authController.loginAdmin);
router.post("/auth/logout", authController.logout);
router.get("/auth/me", protect, restrictTo("ADMIN"), authController.getMe);

// REGISTRATION REQUESTS
router.get("/registration-requests", protect, restrictTo("ADMIN"), adminController.getRegistrationRequests);
router.get("/registration-requests/:request_id", protect, restrictTo("ADMIN"), adminController.getRegistrationRequestById);
router.post("/registration-requests/:request_id/approve", protect, restrictTo("ADMIN"), adminController.approveRegistrationRequest);
router.patch("/registration-requests/:request_id/reject", protect, restrictTo("ADMIN"), adminController.rejectRegistrationRequest);

// CLIENTS
router.get("/clients", protect, restrictTo("ADMIN"), adminController.getClients);
router.get("/clients/:id", protect, restrictTo("ADMIN"), adminController.getClientById);

// DESIGN SUBMISSIONS
router.get("/design-submissions", protect, restrictTo("ADMIN"), designSubmissionController.getAdminSubmissions);
router.get("/design-submissions/:submissionId", protect, restrictTo("ADMIN"), designSubmissionController.getAdminSubmissionById);
router.post("/design-submissions/:submissionId/approve", protect, restrictTo("ADMIN"), designSubmissionController.approveSubmission);
router.patch("/design-submissions/:submissionId/reject", protect, restrictTo("ADMIN"), designSubmissionController.rejectSubmission);

// APPROVED DESIGNS
router.get("/designs", protect, restrictTo("ADMIN"), approvedDesignController.getAdminDesigns);
router.get("/designs/:designId", protect, restrictTo("ADMIN"), approvedDesignController.getAdminDesignById);
router.patch("/designs/:designId/archive", protect, restrictTo("ADMIN"), approvedDesignController.archiveDesign);

// PRINTING SERVICES MANAGEMENT
router.post("/services", protect, restrictTo("ADMIN"), serviceController.createService);

// ORDER CATALOG MANAGEMENT (Categories)
router.post(
  "/order-categories",
  protect,
  restrictTo("ADMIN"),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.get("/order-categories", protect, restrictTo("ADMIN"), categoryController.getCategories);
router.patch(
  "/order-categories/:categoryId",
  protect,
  restrictTo("ADMIN"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

// ORDER CATALOG MANAGEMENT (Products)
router.post(
  "/order-products",
  protect,
  restrictTo("ADMIN"),
  validate(createProductSchema),
  productController.createProduct
);
router.get("/order-products", protect, restrictTo("ADMIN"), productController.getAllProductsAdmin);
router.patch(
  "/order-products/:productId",
  protect,
  restrictTo("ADMIN"),
  validate(updateProductSchema),
  productController.updateProduct
);

// ID CARD ORDERS MANAGEMENT
router.get("/orders/id-cards", protect, restrictTo("ADMIN"), idCardOrderController.getAdminIdCardOrders);
router.get("/orders/id-cards/:orderId", protect, restrictTo("ADMIN"), idCardOrderController.getAdminIdCardOrderById);
router.patch(
  "/orders/id-cards/:orderId/status",
  protect,
  restrictTo("ADMIN"),
  validate(updateIdCardOrderStatusSchema),
  idCardOrderController.updateIdCardOrderStatus
);

export default router;