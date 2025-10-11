import express from "express";
import {getAdminStats} from "../controllers/AdminController.js";
import {authorize} from "../middleware/roleMiddleware.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router(protect);

router.get("/stats", authorize("admin"), getAdminStats);

export default router;