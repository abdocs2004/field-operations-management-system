import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { requireAuth, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth, authorize("SUPER_ADMIN", "ADMIN"));

router.get("/summary", reportController.summary);
router.get("/export/excel", reportController.exportExcel);
router.get("/export/pdf", reportController.exportPdf);

export default router;
