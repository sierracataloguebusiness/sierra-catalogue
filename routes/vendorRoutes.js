import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {getVendorShop, getVendorStats, upsertVendorShop} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("vendor"), getVendorStats);
router.get("/shop", authorize("vendor"), getVendorShop)
router.post("/shop", authorize("vendor"), upsertVendorShop);

export default router;