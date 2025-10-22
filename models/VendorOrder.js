import mongoose from "mongoose";

const VendorOrderSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
                title: String,
                price: Number,
                quantity: Number,
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected", "out_of_stock"],
                    default: "pending",
                },
            },
        ],
        subtotal: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "completed"],
            default: "pending",
        },
        vendorStatus: {
            type: String,
            enum: ["pending", "accepted", "rejected", "partially_accepted"],
            default: "pending",
        },
        delivery: {
            firstName: String,
            lastName: String,
            phone: String,
            method: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
            address: String,
            instructions: String,
        },
    },
    { timestamps: true }
);

const VendorOrder = mongoose.model("VendorOrder", VendorOrderSchema);
export default VendorOrder;
