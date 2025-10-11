import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, isActive } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (role) user.role = role;
        if (typeof isActive === "boolean") user.isActive = isActive;

        await user.save();

        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};