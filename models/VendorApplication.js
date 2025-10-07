import mongoose from "mongoose";

const vendorApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const VendorApplication = mongoose.model("VendorApplication", vendorApplicationSchema);

export default VendorApplication;