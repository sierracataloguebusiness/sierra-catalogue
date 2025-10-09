import VendorApplication from "../models/VendorApplication.js";
import AppError from "../utils/AppError.js";

export const postApplication = async (req, res) => {
    try {
        const { name, email } = req.body;
        let { tel } = req.body;

        if (!name || !tel || !email) {
            throw new AppError("All fields are required", 400);
        }

        tel = tel.trim();
        if (/^0\d{8}$/.test(tel)) {
            tel = "+232" + tel.slice(1);
        } else if (!/^\+232\d{8}$/.test(tel)) {
            throw new AppError("Phone number is invalid (099XXXXXX or +2329XXXXXXX)", 400);
        }

        const existing = await VendorApplication.findOne({ $or: [{ tel }, { email }] });
        if (existing) {
            throw new AppError("An application with this email or phone already exists", 400);
        }

        const application = new VendorApplication({ name, tel, email });
        await application.save();

        res.status(201).json({ message: "Application submitted successfully." });

    } catch (err) {
        if (err) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        console.error("Server error:", err);
        res.status(500).json({ message: "Server error sending application." });
    }
};
