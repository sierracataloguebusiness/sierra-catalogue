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
            vendorOrders: [],
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

        const vendorOrderIds = [];
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

            vendorOrderIds.push(vendorOrder._id);
        }

        order.vendorOrders = vendorOrderIds;
        await order.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
            vendorOrders: vendorOrderIds,
        });
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({ message: "Server error while creating order" });
    }
};

export const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ user: userId })
            .populate("items.listingId", "title price images")
            .sort({ createdAt: -1 });

        const detailedOrders = await Promise.all(
            orders.map(async (order) => {
                const vendorOrders = await VendorOrder.find({ order: order._id });

                const itemsWithStatus = order.items.map((item) => {
                    let status = "pending";

                    for (const vo of vendorOrders) {
                        const voItem = vo.items.find(
                            (i) => i.listingId.toString() === item.listingId._id.toString()
                        );
                        if (voItem) {
                            status = voItem.status || status;
                            break;
                        }
                    }

                    return {
                        ...item.toObject(),
                        status,
                    };
                });

                return {
                    ...order.toObject(),
                    items: itemsWithStatus,
                };
            })
        );

        res.status(200).json({ orders: detailedOrders });
    } catch (err) {
        console.error("getUserOrders error:", err);
        next(new AppError("Failed to fetch orders", 500));
    }
};


export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.listingId", "title price images");

        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        const vendorOrders = await VendorOrder.find({ order: order._id });

        const itemsWithStatus = order.items.map((item) => {
            let status = "pending";
            for (const vo of vendorOrders) {
                const voItem = vo.items.find((i) => i._id.equals(item._id));
                if (voItem) {
                    status = voItem.status || status;
                    break;
                }
            }
            return {
                ...item.toObject(),
                status,
            };
        });

        res.status(200).json({
            order: {
                ...order.toObject(),
                items: itemsWithStatus,
            },
        });
    } catch (err) {
        console.error("getOrder error:", err);
        next(new AppError("Failed to fetch order", 500));
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) return next(new AppError("Order not found", 404));

        order.status = status || order.status;
        await order.save();

        res.status(200).json({
            message: "Order status updated",
            order,
        });
    } catch (err) {
        console.error("updateOrderStatus error:", err);
        next(new AppError("Failed to update order status", 500));
    }
};

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