import express from "express";
import {
    getAllApplications,
    approveVendor,
    rejectVendor,
    submitVendorApplication,
} from "../controllers/vendorApplicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public route (accessible by users)
router.post("/apply", submitVendorApplication);

// Admin routes (protected)
router.get("/", protect, authorize("admin"), getAllApplications);
router.patch("/:id/approve", protect, authorize("admin"), approveVendor);
router.patch("/:id/reject", protect, authorize("admin"), rejectVendor);

export default router;