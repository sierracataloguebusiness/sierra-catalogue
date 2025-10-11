import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const vendors = await User.countDocuments({ role: "vendor" });
        const activeProducts = await Listing.countDocuments({ status: "active" });
        const revenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        res.json({
            totalUsers,
            vendors,
            activeProducts,
            revenue: revenue[0]?.total || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};