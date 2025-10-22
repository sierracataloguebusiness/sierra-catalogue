import { Router } from "express";
import {
    createListing,
    deleteListing,
    getListing,
    getListings,
    updateListing,
} from "../controllers/listingsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import upload from "../config/multerCloudinary.js";

const router = Router();

// Public routes
router.get("/", getListings);
router.get("/:id", getListing);

// Vendor/Admin protected routes
router.post(
    "/",
    protect,
    authorize("vendor", "admin"),
    upload.array("images", 5),
    createListing
);

router.put(
    "/:id",
    protect,
    authorize("vendor", "admin"),
    upload.array("images", 5),
    updateListing
);

router.delete(
    "/:id",
    protect,
    authorize("vendor", "admin"),
    deleteListing
);

export default router;