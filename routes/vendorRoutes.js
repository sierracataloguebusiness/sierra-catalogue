import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {getVendorListings, getVendorShop, getVendorStats, upsertVendorShop} from "../controllers/vendorController.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("vendor"), getVendorStats);
router.get('/listings', protect, authorize('vendor', 'admin'), getVendorListings);
router.get("/shop", protect, authorize("vendor"), getVendorShop)
router.post("/shop", protect, authorize("vendor"), upsertVendorShop);

export default router;