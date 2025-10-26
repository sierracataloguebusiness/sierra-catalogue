import mongoose from "mongoose";

const savedListingsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        listings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

savedListingsSchema.index({ userId: 1, listings: 1 });

const SavedListings = mongoose.model("SavedListings", savedListingsSchema);
export default SavedListings;
