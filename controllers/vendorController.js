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