import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Order from "../models/Order.js";
import AdminLog from "../models/AdminLog.js";
import bcrypt from "bcryptjs";

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
        const users = await User.find({}, "-password").sort({ createdAt: -1 }); // exclude password
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deactivated successfully", user });
    } catch (error) {
        console.error("Error deactivating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User activated successfully", user });
    } catch (error) {
        console.error("Error activating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ["admin", "vendor", "customer"];
        if (!validRoles.includes(role))
            return res.status(400).json({ message: "Invalid role" });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User role updated", user });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getSecuritySettings = async (req, res) => {
    try {
        const adminLogs = await AdminLog.find()
            .sort({ createdAt: -1 })
            .limit(10);
        const timeout = process.env.SESSION_TIMEOUT || "1h";

        res.json({ logs: adminLogs, timeout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching security settings" });
    }
};

export const updateSessionTimeout = async (req, res) => {
    try {
        const { timeout } = req.body;
        process.env.SESSION_TIMEOUT = timeout;
        res.json({ message: "Session timeout updated successfully", timeout });
    } catch (error) {
        res.status(500).json({ message: "Error updating timeout" });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select("-password");
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateAdminProfile = async (req, res) => {
    try {
        const { firstName, lastName, tel, email } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, tel, email },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated successfully", updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating password" });
    }
};

export const logoutAllSessions = async (req, res) => {
    try {
        res.json({ message: "All sessions logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out sessions" });
    }
};