import Listing from "../models/Listing.js";
import VendorOrder from "../models/VendorOrder.js";
import VendorShop from "../models/VendorShop.js";
import AppError from "../utils/AppError.js";
import {allowedStatuses, updateMainOrderStatus, updateVendorOrder} from "../middleware/calculateOrderItemStatus.js";

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

export const upsertVendorShop = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const { name, description, address, logo, banner } = req.body;

        const shop = await VendorShop.findOneAndUpdate(
            { vendor: vendorId },
            { name, description, address, logo, banner, status: "active" },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ message: "Shop saved successfully", shop });
    } catch (err) {
        console.error("Error upserting vendor shop:", err);
        next(new AppError("Failed to save vendor shop", 500));
    }
};

export const getVendorShop = async (req, res) => {
    try{
        const vendorId = req.user.id;
        const shop = await VendorShop.findOne({ vendor: vendorId });

        if (!shop) throw new AppError("No shop found for this vendor", 404);

        res.status(200).json({ shop });
    } catch (err) {
        console.error("Error getting vendor shop:", err);
    }

};

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

export const updateVendorOrderItemStatus = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const { orderId, itemId } = req.params;
        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await updateVendorOrder(orderId, vendorId, itemId, status);
        if (!order) {
            return res.status(404).json({ message: "Vendor order not found" });
        }

        await updateMainOrderStatus(order.order);

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

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No items provided for update" });
        }

        const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
        if (!order) return res.status(404).json({ message: "Vendor order not found" });

        let updatedCount = 0;

        items.forEach(({ _id, status }) => {
            if (!allowedStatuses.includes(status)) return;
            const item = order.items.id(_id);
            if (item) {
                item.status = status;
                updatedCount++;
            }
        });

        if (updatedCount === 0) {
            return res.status(400).json({ message: "No valid items found to update" });
        }

        const statuses = order.items.map(i => i.status || "pending");
        if (statuses.every(s => s === "accepted")) order.vendorStatus = "accepted";
        else if (statuses.every(s => s === "rejected")) order.vendorStatus = "rejected";
        else if (statuses.includes("accepted") && statuses.includes("rejected")) order.vendorStatus = "partially_accepted";
        else order.vendorStatus = "pending";

        await order.save();

        await updateMainOrderStatus(order.order);

        res.status(200).json({ message: "Bulk item status updated", order });
    } catch (err) {
        console.error("Bulk update error:", err);
        next(new AppError("Failed to update vendor order items", 500));
    }
};