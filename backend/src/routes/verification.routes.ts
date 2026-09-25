import { Router } from "express";
import { verificationController } from "../controllers/verification.controller";

const router = Router();

// Public — no authentication required.
router.get("/:receiptNumber", verificationController.verify);

export default router;
