import express from "express";
import {
    getAdminStats,
    getAllUsers,
    deleteUser,
    deactivateUser,
    activateUser,
    updateUserRole,
} from "../controllers/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {changeVendorRole, getAllVendors, toggleVendorStatus} from "../controllers/vendorApplicationController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);

router.get("/users", getAllUsers);
router.patch("/users/:id/deactivate", deactivateUser);
router.patch("/users/:id/activate", activateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

router.get("/vendors", protect, authorize("admin"), getAllVendors);
router.patch("vendors/:id/toggle", protect, authorize("admin"), toggleVendorStatus);
router.patch("vendors/:id/role", protect, authorize("admin"), changeVendorRole);

export default router;