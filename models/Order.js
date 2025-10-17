import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
                vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
                title: String,
                price: Number,
                quantity: Number,
            },
        ],
        delivery: {
            firstName: String,
            lastName: String,
            phone: String,
            method: {
                type: String,
                enum: ["delivery", "pickup"],
                default: "delivery",
            },
            address: String,
            instructions: String,
        },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        vendorOrders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "VendorOrder",
            },
        ],
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;