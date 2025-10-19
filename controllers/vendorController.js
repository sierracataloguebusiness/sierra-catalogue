import Listing from "../models/Listing.js";
import VendorOrder from "../models/VendorOrder.js";

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