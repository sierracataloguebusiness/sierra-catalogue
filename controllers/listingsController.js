import Listing from "../models/Listing.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const createListing = async (req, res) => {
    try {
        const { title, categoryId, description, price, stock } = req.body;
        const vendor = req.user.id;

        if (!title || !categoryId || !price) {
            return res.status(400).json({ message: "Title, category, and price are required" });
        }

        const priceNum = Number(price);
        const stockNum = Number(stock) || 0;

        if (priceNum < 0) return res.status(400).json({ message: "Price cannot be below 0" });
        if (stockNum < 0) return res.status(400).json({ message: "Stock cannot be below 0" });

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) return res.status(400).json({ message: "Invalid category selected" });

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: "sierra-catalogue/listings",
                }).catch(err => {
                    console.warn(`Failed to upload image ${file.originalname}:`, err.message);
                    return null; // Skip failed uploads
                })
            );
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.filter(r => r).map(r => r.secure_url);
        }

        const newListing = await Listing.create({
            title,
            description,
            images: imageUrls,
            price: priceNum,
            stock: stockNum,
            vendor,
            categoryId,
        });

        res.status(201).json({
            message: "Successfully created listing",
            listing: newListing,
        });

    } catch (err) {
        console.error("Create Listing Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const vendor = req.user.id;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (req.user.role === "vendor" && listing.vendor.toString() !== vendor) {
            return res.status(403).json({ message: "You do not have permission to update this listing" });
        }

        const { title, description, price, stock, categoryId, isActive } = req.body;

        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) return res.status(400).json({ message: "Invalid category selected" });
            listing.categoryId = categoryId;
        }

        if (price !== undefined && price < 0) return res.status(400).json({ message: "Price cannot be below 0" });
        if (stock !== undefined && stock < 0) return res.status(400).json({ message: "Stock cannot be below 0" });

        Object.assign(listing, { title, description, price, stock, isActive });

        if (req.files && req.files.length > 0) {
            if (listing.images?.length) {
                for (const img of listing.images) {
                    try {
                        const url = new URL(img);
                        const pathnameParts = url.pathname.split('/');
                        const publicIdWithExt = pathnameParts.slice(-2).join('/');
                        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.warn(`Failed to delete old image ${img}:`, err.message);
                    }
                }
            }

            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path, {
                    folder: "sierra-catalogue/listings",
                }).catch(err => {
                    console.warn(`Failed to upload new image ${file.originalname}:`, err.message);
                    return null;
                })
            );

            const uploadResults = await Promise.all(uploadPromises);
            listing.images = uploadResults.filter(r => r).map(r => r.secure_url);
        }

        await listing.save({ validateBeforeSave: true });

        res.status(200).json({ message: "Successfully updated listing", listing });

    } catch (err) {
        console.error("Update Listing Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const vendor = req.user.id;

        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (req.user.role === "vendor" && listing.vendor.toString() !== vendor) {
            return res.status(403).json({ message: "You do not have permission to delete this listing" });
        }

        if (listing.images?.length) {
            for (const img of listing.images) {
                try {
                    const url = new URL(img);
                    const pathnameParts = url.pathname.split('/');
                    const publicIdWithExt = pathnameParts.slice(-2).join('/');
                    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.warn(`Failed to delete image ${img}:`, err.message);
                }
            }
        }

        await listing.deleteOne();

        res.status(200).json({ message: "Successfully deleted listing" });

    } catch (err) {
        console.error("Delete Listing Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getListings = async (req, res) => {
    try {
        const { search, categories, limit = 20 } = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (categories) {
            const categoryArray = categories.split(",");
            filter.categoryId = { $in: categoryArray };
        }

        const listings = await Listing.find(filter)
            .limit(Number(limit))
            .populate("categoryId", "name")
            .populate("vendor", "name");

        res.status(200).json({ listings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: "Server error fetching listings"});
    }
};

export const getListing = async (req, res) => {
    try {
        const product = await Listing.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};