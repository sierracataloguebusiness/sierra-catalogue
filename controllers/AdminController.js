import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const vendors = await User.countDocuments({ role: "vendor" });
        const activeProducts = await Listing.countDocuments({ isActive: true });
        const revenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        res.json({
            users: totalUsers,
            vendors,
            products: activeProducts,
            revenue: revenue[0]?.total || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};