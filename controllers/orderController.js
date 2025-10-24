import Cart from "../models/Cart.js";
import AppError from "../utils/AppError.js";
import Order from "../models/Order.js";
import VendorOrder from "../models/VendorOrder.js";
import Listing from "../models/Listing.js";

export const createOrder = async (req, res) => {
    try {
        const { items, delivery, total } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const order = await Order.create({
            user: userId,
            items,
            delivery,
            total,
            status: "pending",
        });

        const listings = await Listing.find({
            _id: { $in: items.map((i) => i.listingId) },
        }).populate("vendor");

        const vendorMap = {};
        items.forEach((item) => {
            const listing = listings.find(
                (l) => l._id.toString() === item.listingId.toString()
            );
            if (!listing) return;

            const vendorId = listing.vendor._id.toString();
            if (!vendorMap[vendorId]) vendorMap[vendorId] = [];
            vendorMap[vendorId].push(item);
        });

        const vendorOrders = [];
        for (const [vendorId, vendorItems] of Object.entries(vendorMap)) {
            const subtotal = vendorItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const vendorOrder = await VendorOrder.create({
                order: order._id,
                vendor: vendorId,
                buyer: userId,
                items: vendorItems,
                subtotal,
                delivery,
                status: "pending",
            });

            vendorOrders.push(vendorOrder);
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
            vendorOrders,
        });
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({ message: "Server error while creating order" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.listingId", "title price images");

        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

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

        const cart = await Cart.findOne({ userId }).populate("items.listingId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

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