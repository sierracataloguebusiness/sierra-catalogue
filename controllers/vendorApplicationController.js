import VendorApplication from "../models/VendorApplication.js";

export const postApplication = async (req, res) =>  {
    try {
        const { name, phone, email } = req.body;

        if (!name || !phone || !email) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const application = new VendorApplication({ name, phone, email });
        await application.save();

        res.status(201).json({ message: "Application submitted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}