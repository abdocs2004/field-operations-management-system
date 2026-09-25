import { Router } from "express";
import { announcementController } from "../controllers/announcement.controller";
import { requireAuth, authorize } from "../middleware/auth.middleware";

const router = Router();

// Public — powers the homepage/dashboard announcement bar
router.get("/public", announcementController.listActivePublic);

router.use(requireAuth, authorize("SUPER_ADMIN"));
router.get("/", announcementController.listAll);
router.post("/", announcementController.create);
router.put("/:id", announcementController.update);
router.delete("/:id", announcementController.remove);

export default router;
