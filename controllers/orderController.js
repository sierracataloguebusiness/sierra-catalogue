import Cart from "../models/Cart.js";
import AppError from "../utils/AppError.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const { items, delivery, total } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const order = new Order({
            user: req.user.id,
            items,
            delivery,
            total,
            status: "pending",
        });

        await order.save();
        res.json({ success: true, order });
    } catch (err) {
        console.error("Order error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const getUserOrders = async (req, res) => {
    const userId = req.user.id;

    const orders = await  Order.find({userId})
        .sort({ createdAt: -1 })
        .populate('items.listingId', 'title price images');

    res.status(200).json({ orders });
}

export const getOrder = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('items.listingId', 'title price images');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    res.status(200).json({ order });
}

export const updateOrderStatus = async (req, res) => {
    const {status} = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new AppError('Order not found', 404);
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json({
        message: 'Order status updated',
        order
    })
}

export const checkout = async (req, res) => {
    try {
        const userId = req.user._id; // assuming you have auth middleware setting req.user
        const { address, paymentMethod } = req.body;

        // Get the user's cart
        const cart = await Cart.findOne({ userId }).populate("items.listingId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            const price = item.listingId?.price ?? 0;
            return sum + price * (item.quantity ?? 0);
        }, 0);

        // Create order
        const order = new Order({
            userId,
            items: cart.items,
            total,
            address,
            paymentMethod,
            status: paymentMethod === "cod" ? "pending" : "paid", // basic logic
        });

        await order.save();

        // Optionally, clear the cart after checkout
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};