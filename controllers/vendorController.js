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

// ✅ Get all vendor orders
export const getVendorOrders = async (req, res, next) => {
    try {
        const vendorId = req.user.id;

        const orders = await VendorOrder.find({ vendor: vendorId })
            .populate("buyer", "name email")
            .populate("items.listingId", "title price images")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (err) {
        console.error("Error fetching vendor orders:", err);
        next(new AppError("Failed to fetch vendor orders", 500));
    }
};

// ✅ Update single item in an order
export const updateVendorOrderItemStatus = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const { orderId, itemId } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected", "out_of_stock", "pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const item = order.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.status = status;

        // ✅ update overall order status
        const statuses = order.items.map(i => i.status || "pending");
        if (statuses.every(s => s === "accepted")) order.status = "accepted";
        else if (statuses.every(s => s === "rejected")) order.status = "rejected";
        else if (statuses.includes("accepted") && statuses.includes("rejected")) order.status = "partially_accepted";
        else order.status = "pending";

        await order.save();

        res.status(200).json({ message: "Item status updated", order });
    } catch (err) {
        console.error("Error updating vendor order item:", err);
        next(new AppError("Failed to update vendor order item", 500));
    }
};

export const updateVendorOrderItemsBulk = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const { orderId } = req.params;
        const { items } = req.body;

        const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Update item statuses
        items.forEach(({ _id, status }) => {
            if (!["accepted", "rejected", "out_of_stock", "pending"].includes(status)) return;
            const item = order.items.id(mongoose.Types.ObjectId(_id));
            if (item) item.status = status;
        });

        // Derive vendorStatus based on item statuses
        const statuses = order.items.map(i => i.status || "pending");
        if (statuses.every(s => s === "accepted")) order.vendorStatus = "accepted";
        else if (statuses.every(s => s === "rejected")) order.vendorStatus = "rejected";
        else if (statuses.includes("accepted") && statuses.includes("rejected")) order.vendorStatus = "partially_accepted";
        else order.vendorStatus = "pending";

        await order.save();

        res.status(200).json({ message: "Bulk item status updated", order });
    } catch (err) {
        console.error("Bulk update error:", err);
        next(new AppError("Failed to update vendor order items", 500));
    }
};
