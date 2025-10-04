import {Router} from 'express';
import {protect} from "../middleware/authMiddleware.js";
import {addToCart, clearCart, getCart, removeFromCart, updateQuantity} from "../controllers/cartController.js";

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;