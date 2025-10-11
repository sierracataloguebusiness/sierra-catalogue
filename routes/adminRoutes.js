import express from "express";
import {deleteUser, getAdminStats, getAllUsers} from "../controllers/AdminController.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;