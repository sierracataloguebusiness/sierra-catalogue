import {Router} from 'express';
import {checkout, createOrder, getOrder, getUserOrders, updateOrderStatus} from "../controllers/orderController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = Router();

router.post('/create', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.post('/checkout', protect, checkout);

export default router;