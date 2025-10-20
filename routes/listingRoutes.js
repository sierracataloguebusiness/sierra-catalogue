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
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', protect, authorize('vendor', 'admin'), upload.single("images"), createListing);
router.put('/:id', protect, authorize('vendor', 'admin'), updateListing);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteListing);

export default router;