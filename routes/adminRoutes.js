import express from "express";
import {
    getAdminStats,
    getAllUsers,
    deleteUser,
    deactivateUser,
    activateUser,
    updateUserRole,
    getSecuritySettings,
    updateSessionTimeout,
    getAdminProfile,
    updateAdminProfile,
    logoutAllSessions,
} from "../controllers/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {changeVendorRole, getAllVendors, toggleVendorStatus} from "../controllers/vendorApplicationController.js";
import {changePassword} from "../controllers/userController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);

router.get("/users", getAllUsers);
router.patch("/users/:id/deactivate", deactivateUser);
router.patch("/users/:id/activate", activateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);

router.get("/vendors", getAllVendors);
router.patch("vendors/:id/toggle", toggleVendorStatus);
router.patch("vendors/:id/role", changeVendorRole);

router.get("/security", getSecuritySettings);
router.post("/security/timeout", updateSessionTimeout);
router.get("/profile", getAdminProfile);
router.put("/profile/update", updateAdminProfile);
router.put("/password", changePassword);
router.post("/logout-all", logoutAllSessions);


export default router;