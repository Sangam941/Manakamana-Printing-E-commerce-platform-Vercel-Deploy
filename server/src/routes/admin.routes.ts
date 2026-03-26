import { Router } from "express";
<<<<<<< HEAD
import {
  getRegistrationRequests,
  getRegistrationRequestById,
  approveRegistrationRequest,
  rejectRegistrationRequest,
  getPendingDesignSubmissions,
  getDesignSubmissionById,
  approveDesignSubmission,
  rejectDesignSubmission,
  getApprovedDesigns,
  getApprovedDesignByIdAdmin,
  deleteApprovedDesign,
  loginAdmin,
  logoutAdmin
} from "../controller/admin.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../validators/auth.validators";

const router = Router();

// Public Route
router.post("/login", validate(loginSchema), loginAdmin);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo("ADMIN"));

router.post("/logout", logoutAdmin);

router.get("/registration-requests", getRegistrationRequests);

router.get(
  "/registration-requests/:request_id",
  getRegistrationRequestById
);

router.post(
  "/registration-requests/:request_id/approve",
  approveRegistrationRequest
);

router.patch(
  "/registration-requests/:request_id/reject",
  rejectRegistrationRequest
);

router.get("/designs/submissions", getPendingDesignSubmissions);
router.get("/designs/submissions/:submission_id", getDesignSubmissionById);
router.post("/designs", approveDesignSubmission);
router.patch("/designs/submissions/:submission_id/reject", rejectDesignSubmission);
router.get("/designs", getApprovedDesigns);
router.get("/designs/:design_id", getApprovedDesignByIdAdmin);
router.delete("/designs/:design_id", deleteApprovedDesign);
=======
import * as adminController from "../controller/admin.controller";
import * as authController from "../controller/auth.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";
import * as designSubmissionController from "../controller/design-submission.controller";
import * as approvedDesignController from "../controller/approved-design.controller";
import * as serviceController from "../controller/printing-service.controller";
import * as adminProductController from "../controller/admin-product.controller";
import * as productOrderController from "../controller/product-order.controller";
import { validate } from "../middleware/validate.middleware";
// Legacy validators removed

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

// UNIVERSAL PRODUCT & PRICING MANAGEMENT
router.post("/products", protect, restrictTo("ADMIN"), adminProductController.createProduct);
router.get("/products", protect, restrictTo("ADMIN"), adminProductController.getAllProducts);
router.post("/products/:productId/variants", protect, restrictTo("ADMIN"), adminProductController.createVariant);
router.post("/variants/:variantId/option-groups", protect, restrictTo("ADMIN"), adminProductController.createOptionGroup);
router.post("/groups/:groupId/option-values", protect, restrictTo("ADMIN"), adminProductController.createOptionValue);
router.post("/variants/:variantId/pricing", protect, restrictTo("ADMIN"), adminProductController.createVariantPricing);
router.get("/variants/:variantId/full-details", protect, restrictTo("ADMIN"), adminProductController.getVariantFullDetails);

// ORDERS MANAGEMENT
router.patch("/orders/:orderId/status", protect, restrictTo("ADMIN"), productOrderController.updateOrderStatus);
router.get("/orders/:orderId", protect, restrictTo("ADMIN"), productOrderController.getOrderDetails);
>>>>>>> feat/updatedb

export default router;