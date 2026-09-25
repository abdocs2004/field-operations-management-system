import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);

router.get("/summary", dashboardController.summary);
router.get("/operations-trend", dashboardController.operationsTrend);
router.get("/revenue-trend", dashboardController.revenueTrend);
router.get("/service-distribution", dashboardController.serviceDistribution);
router.get("/status-distribution", dashboardController.statusDistribution);

export default router;
