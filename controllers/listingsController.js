import Listing from "../models/Listing.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const createListing = async (req, res) => {
    try {
        const { title, categoryId, description, price, stock } = req.body;
        const vendor = req.user.id;

        // Validation
        if (!title || !categoryId || !price) {
            return res.status(400).json({ message: "Title, category, and price are required" });
        }

        const priceNum = Number(price);
        const stockNum = Number(stock) || 0;

        if (priceNum < 0) return res.status(400).json({ message: "Price cannot be below 0" });
        if (stockNum < 0) return res.status(400).json({ message: "Stock cannot be below 0" });

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) return res.status(400).json({ message: "Invalid category selected" });

        // Images: Multer + CloudinaryStorage handles upload automatically
        const imageUrls = (req.files || []).map(file => file.path || file.filename).filter(Boolean);

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

        // Vendor permission check
        if (req.user.role === "vendor" && listing.vendor.toString() !== vendor) {
            return res.status(403).json({ message: "You do not have permission to update this listing" });
        }

        const { title, description, price, stock, categoryId, isActive } = req.body;

        // Validate category if provided
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) return res.status(400).json({ message: "Invalid category selected" });
            listing.categoryId = categoryId;
        }

        if (price !== undefined && price < 0) return res.status(400).json({ message: "Price cannot be below 0" });
        if (stock !== undefined && stock < 0) return res.status(400).json({ message: "Stock cannot be below 0" });

        // Update fields
        Object.assign(listing, { title, description, price, stock, isActive });

        // Replace images safely if new ones uploaded
        if (req.files && req.files.length > 0) {
            // Delete old images safely
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

            // Use URLs from Multer/CloudinaryStorage
            listing.images = req.files.map(file => file.path || file.filename).filter(Boolean);
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
        const { search, categories, limit = 20, page = 1 } = req.query;

        let filter = {};
        if (search) filter.title = { $regex: search, $options: "i" };
        if (categories) filter.categoryId = { $in: categories.split(",") };

        const total = await Listing.countDocuments(filter);

        const listings = await Listing.find(filter)
            .skip((page - 1) * Number(limit))
            .limit(Number(limit))
            .populate("categoryId", "name")
            .populate("vendor", "name");

        res.status(200).json({
            listings,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ message: "Server error fetching listings" });
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