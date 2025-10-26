import SavedListings from "../models/SavedListings.js";
import Listing from "../models/Listing.js";
import AppError from "../utils/AppError.js";


export const getSavedListings = async (req, res, next) => {
    try {
        const saved = await SavedListings.findOne({ userId: req.user.id })
            .populate("listings", "title price images categoryId")
            .lean();

        res.status(200).json({
            success: true,
            savedListings: saved?.listings || [],
        });
    } catch (err) {
        next(err);
    }
};

export const addSavedListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        const listingExists = await Listing.findById(listingId);
        if (!listingExists) throw new AppError("Listing not found", 404);

        const saved = await SavedListings.findOneAndUpdate(
            { userId },
            { $addToSet: { listings: listingId } }, // prevents duplicates
            { new: true, upsert: true }
        ).populate("listings", "title price images");

        res.status(200).json({
            success: true,
            message: "Listing saved successfully",
            savedListings: saved.listings,
        });
    } catch (err) {
        next(err);
    }
};

export const removeSavedListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.id;

        const saved = await SavedListings.findOneAndUpdate(
            { userId },
            { $pull: { listings: listingId } },
            { new: true }
        ).populate("listings", "title price images");

        if (!saved) throw new AppError("No saved listings found for user", 404);

        res.status(200).json({
            success: true,
            message: "Listing removed from saved items",
            savedListings: saved.listings,
        });
    } catch (err) {
        next(err);
    }
};
