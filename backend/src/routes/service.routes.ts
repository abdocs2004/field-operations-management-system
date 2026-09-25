import { Router } from "express";
import { serviceController } from "../controllers/service.controller";
import { requireAuth, authorize } from "../middleware/auth.middleware";

const router = Router();

// Any authenticated user (including FIELD_USER) needs the active list to
// populate the field-entry dropdown.
router.get("/active", requireAuth, serviceController.listActive);

router.use(requireAuth, authorize("SUPER_ADMIN"));
router.get("/", serviceController.listAll);
router.post("/", serviceController.create);
router.put("/:id", serviceController.update);
router.delete("/:id", serviceController.remove);

export default router;
