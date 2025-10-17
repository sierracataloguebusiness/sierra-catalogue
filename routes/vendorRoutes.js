import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getVendorStats } from "../controllers/VendorController.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("vendor"), getVendorStats);

export default router;