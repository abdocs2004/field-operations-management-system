import { Router } from "express";
import { operationController } from "../controllers/operation.controller";
import { requireAuth, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

// All authenticated roles can list/view (repository scopes FIELD_USER to their own rows)
router.get("/", operationController.list);
router.get("/:id", operationController.getById);
router.get("/:id/receipt", operationController.getReceipt);
router.get("/:id/receipt/pdf", operationController.getReceiptPdf);

// FIELD_USER may create; everyone but... update rules enforced in service
router.post("/", operationController.create);
router.put("/:id", authorize("SUPER_ADMIN", "ADMIN", "FIELD_USER"), operationController.update);

// Only admins may delete arbitrary operations
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN"), operationController.remove);

export default router;
