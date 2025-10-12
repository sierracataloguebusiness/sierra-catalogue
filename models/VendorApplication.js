import mongoose from "mongoose";

const vendorApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    tel: { type: String, required: true, match: [/^\+232\d{8}$/, 'Invalid phone number format (must be +2329XXXXXXX)'] },
    shopName: { type: String, required: true },
    shopDescription: { type: String },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("VendorApplication", vendorApplicationSchema);