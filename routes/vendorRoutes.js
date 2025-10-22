import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
    getVendorStats,
    getVendorListings,
    getVendorShop,
    upsertVendorShop,
    getVendorOrders,
    updateVendorOrderStatus,
    updateVendorOrderItemsStatus
} from "../controllers/vendorController.js";

const router = express.Router();

// Dashboard / Shop
router.get("/dashboard", protect, authorize("vendor"), getVendorStats);
router.get("/listings", protect, authorize("vendor", "admin"), getVendorListings);
router.get("/shop", protect, authorize("vendor"), getVendorShop);
router.post("/shop", protect, authorize("vendor"), upsertVendorShop);

// Orders
router.get("/orders", protect, authorize("vendor"), getVendorOrders);
router.put("/orders/:orderId/status", protect, authorize("vendor"), updateVendorOrderStatus);
router.put("/orders/:orderId/items", protect, authorize("vendor"), updateVendorOrderItemsStatus);

export default router;
