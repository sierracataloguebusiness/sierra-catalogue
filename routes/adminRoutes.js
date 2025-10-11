import express from "express";
import {
    getAdminStats,
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:id", protect, authorize("admin"), updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;