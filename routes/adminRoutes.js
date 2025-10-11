import express from "express";
import {getAdminStats} from "../controllers/AdminController.js";
import {authorize} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", authorize("admin"), getAdminStats);

export default router;