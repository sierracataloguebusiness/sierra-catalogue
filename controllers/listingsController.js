import Listing from "../models/Listing.js";
import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";

export const createListing = async (req, res) => {
    try {
        const { title, categoryId, description, price, stock } = req.body;
        const vendor = req.user.id;

        const priceNum = Number(price);
        const stockNum = Number(stock) || 0;

        if (!title || !categoryId || !price) {
            return res.status(400).json({ message: "Title, category, and price are required" });
        }

        if (priceNum < 0) return res.status(400).json({ message: "Price cannot be below 0" });
        if (stockNum < 0) return res.status(400).json({ message: "Stock cannot be below 0" });

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ message: "Invalid category selected" });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newListing = await Listing.create({
            title,
            description,
            images: imagePath ? [imagePath] : [],
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
    const listingId = req.params.id;
    const vendor = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError('Listing not found', 404);

    const { title, description, price, stock, categoryId, isActive } = req.body;

    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) throw new AppError('Invalid category selected', 404);
        listing.categoryId = categoryId;
    }

    if (req.user.role === 'vendor' && listing.vendor.toString() !== vendor) {
        throw new AppError('You do not have permission to update this listing', 403);
    }

    if (price !== undefined && price < 0) throw new AppError('Price cannot be below 0', 400);
    if (stock !== undefined && stock < 0) throw new AppError('Stock cannot be below 0', 400);

    Object.assign(listing, { title, description, price, stock, isActive });

    if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        listing.images = [imagePath];
    }

    await listing.save({ validateBeforeSave: true });

    res.status(200).json({
        message: 'Successfully updated listing',
        listing
    });
};

export const deleteListing = async (req, res) => {
    const listingId = req.params.id;
    const vendor = req.user.id;

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError('Listing not found', 404);

    if (req.user.role === 'vendor' && listing.vendor.toString() !== vendor) {
        throw new AppError('You do not have permission to delete this listing', 403);
    }

    await listing.deleteOne();

    res.status(200).json({
        message: 'Successfully deleted listing',
    });
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