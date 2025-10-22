import Listing from "../models/Listing.js";
import VendorOrder from "../models/VendorOrder.js";
import VendorShop from "../models/VendorShop.js";
import AppError from "../utils/AppError.js";

export const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const totalProducts = await Listing.countDocuments({ vendor: vendorId });
        const activeProducts = await Listing.countDocuments({
            vendor: vendorId,
            isActive: true,
        });

        const totalOrders = await VendorOrder.countDocuments({ vendor: vendorId });

        res.status(200).json({
            totalProducts,
            activeProducts,
            totalOrders,
        });
    } catch (error) {
        console.error("Vendor stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getVendorListings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const vendorId = req.user.id;

        const listings = await Listing.find({ vendor: vendorId }).sort({ createdAt: -1 }).lean();

        res.status(200).json({ listings });
    } catch (err) {
        console.error("getVendorListings error:", err);
        res.status(500).json({
            message: "Server error fetching vendor listings",
        });
    }
};

export const upsertVendorShop = async (req, res) => {
    const vendorId = req.user.id;
    const { name, description, address, logo, banner } = req.body;

    const shop = await VendorShop.findOneAndUpdate(
        { vendor: vendorId },
        { name, description, address, logo, banner, status: "active" },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: "Shop saved successfully", shop });
};

export const getVendorShop = async (req, res) => {
    const vendorId = req.user.id;
    const shop = await VendorShop.findOne({ vendor: vendorId });

    if (!shop) throw new AppError("No shop found for this vendor", 404);

    res.status(200).json({ shop });
};

export const getVendorOrders = async (req, res) => {
    const vendorId = req.user.id;

    const orders = await VendorOrder.find({ vendor: vendorId })
        .populate("buyer", "name email")
        .populate("items.listingId", "title price images")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
};

export const updateVendorOrderStatus = async (req, res) => {
    const vendorId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ success: true, order });
};

export const updateVendorOrderItemsStatus = async (req, res) => {
    const vendorId = req.user.id;
    const { orderId } = req.params;
    const { items } = req.body; // [{ _id, status }]

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Items array required" });
    }

    const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    for (const { _id, status } of items) {
        if (!["accepted", "rejected", "out_of_stock"].includes(status)) continue;
        const item = order.items.id(_id);
        if (item) item.status = status;
    }

    // Determine overall order status
    const allStatuses = order.items.map(i => i.status || "pending");
    if (allStatuses.every(s => s === "accepted")) {
        order.status = "accepted";
    } else if (allStatuses.every(s => s !== "pending")) {
        order.status = "partially_accepted";
    } else {
        order.status = "pending";
    }

    await order.save();
    res.json({ success: true, order });
};