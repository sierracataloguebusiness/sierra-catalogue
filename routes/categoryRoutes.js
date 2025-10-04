import {Router} from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory
} from "../controllers/categoryController.js";
import {protect} from "../middleware/authMiddleware.js";
import {authorize} from "../middleware/roleMiddleware.js";

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
