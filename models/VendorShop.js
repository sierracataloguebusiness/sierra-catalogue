import mongoose from "mongoose";

const VendorShopSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 300,
        },
        logo: {
            type: String,
            default: "/assets/default-shop.png",
        },
        banner: {
            type: String,
            default: "",
        },
        address: String,
        status: {
            type: String,
            enum: ["active", "under review", "suspended"],
            default: "under review",
        },
        totalProducts: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const VendorShop = mongoose.model("VendorShop", VendorShopSchema);

export default VendorShop;