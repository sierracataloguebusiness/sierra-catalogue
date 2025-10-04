import {Router} from "express";
import {
    createListing,
    deleteListing,
    getListing,
    getListings,
    updateListing
} from "../controllers/listingsController.js";
import {protect} from "../middleware/authMiddleware.js";
import {authorize} from "../middleware/roleMiddleware.js";

const router = Router();

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', protect, authorize('vendor', 'admin'), createListing);
router.put('/:id', protect, authorize('vendor', 'admin'), updateListing);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteListing);

export default router;