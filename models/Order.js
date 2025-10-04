import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
                title: String,
                price: Number,
                quantity: Number,
            },
        ],
        delivery: {
            firstName: String,
            lastName: String,
            phone: String,
            method: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
            address: String,
            instructions: String,
        },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);