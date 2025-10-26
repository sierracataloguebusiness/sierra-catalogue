import { Router } from "express";
import {
    getSavedListings,
    addSavedListing,
    removeSavedListing,
} from "../controllers/savedListingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getSavedListings);
router.post("/:listingId", protect, addSavedListing);
router.delete("/:listingId", protect, removeSavedListing);

export default router;
