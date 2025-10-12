import VendorApplication from "../models/VendorApplication.js";
import User from "../models/User.js";

export const getAllVendors = async (req, res) => {
    try {
        const { search, status } = req.query;
        const query = { role: "vendor" };

        if (search) {
            query.$or = [
                { firstName: new RegExp(search, "i") },
                { lastName: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
                { tel: new RegExp(search, "i") },
            ];
        }

        if (status) {
            query.isActive = status === "active";
        }

        const vendors = await User.find(query).select("-password");
        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch vendors" });
    }
};

export const toggleVendorStatus = async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);
        if (!vendor || vendor.role !== "vendor") {
            return res.status(404).json({ message: "Vendor not found" });
        }

        vendor.isActive = !vendor.isActive;
        await vendor.save();
        res.json({ message: "Vendor status updated", vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update vendor status" });
    }
};

export const changeVendorRole = async (req, res) => {
    try {
        const { newRole } = req.body;
        const vendor = await User.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (!["customer", "vendor", "admin"].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        vendor.role = newRole;
        await vendor.save();

        res.json({ message: "Role updated successfully", vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to change vendor role" });
    }
};

export const submitVendorApplication = async (req, res) => {
    try {
        let { name, email, tel, shopName, shopDescription, address } = req.body;

        if (!name || !email || !tel || !shopName || !address) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        if (/^0\d{8}$/.test(tel)) {
            tel = `+232${tel.slice(1)}`;
        } else if (!/^\+232\d{8}$/.test(tel)) {
            return res.status(400).json({
                message: "Invalid phone number format. Must be +232XXXXXXXX or 0XXXXXXXX.",
            });
        }

        const existing = await VendorApplication.findOne({
            email,
            status: { $in: ["pending", "approved"] },
        });

        if (existing) {
            return res.status(400).json({
                message: "You already have a pending or approved vendor application.",
            });
        }

        const application = await VendorApplication.create({
            name,
            email,
            tel,
            shopName,
            shopDescription,
            address,
            appliedBy: req.user?._id || null,
        });

        res.status(201).json({
            message: "Vendor application submitted successfully!",
            application,
        });
    } catch (error) {
        console.error("Error submitting vendor application:", error.message);
        res.status(500).json({
            message: error.message || "Failed to submit vendor application.",
        });
    }
};


export const getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const applications = await VendorApplication.find(query);
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch vendor applications" });
    }
};

export const approveVendor = async (req, res) => {
    try {
        const application = await VendorApplication.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        const user = await User.findOne({ email: application.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = "vendor";
        user.isActive = true;
        await user.save();

        application.status = "approved";
        await application.save();

        res.json({ message: "Vendor approved successfully", application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to approve vendor" });
    }
};

export const rejectVendor = async (req, res) => {
    try {
        const application = await VendorApplication.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        application.status = "rejected";
        await application.save();

        res.json({ message: "Vendor application rejected", application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to reject vendor" });
    }
};