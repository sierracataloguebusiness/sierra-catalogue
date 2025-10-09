import mongoose from "mongoose";

const vendorApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    tel: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+232\d{8}$/, "Invalid phone number format (must be +2329XXXXXXX)"],
    },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    submittedAt: { type: Date, default: Date.now },
});

const VendorApplication = mongoose.model("VendorApplication", vendorApplicationSchema);

export default VendorApplication;