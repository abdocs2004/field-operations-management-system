import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth, authorize("SUPER_ADMIN"));

router.get("/", userController.list);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.post("/:id/reset-password", userController.resetPassword);

export default router;
