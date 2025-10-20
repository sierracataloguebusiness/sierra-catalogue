import Listing from "../models/Listing.js";
import fs from "fs";
import path from "path";


export const createListing = async (req, res) => {
    try {
        const { title, price, stock, categoryId, description } = req.body;
        const image = req.file;

        if (!title || !price || !categoryId) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const images = [];
        if (image) images.push(`/uploads/${image.filename}`);

        const listing = await Listing.create({
            title,
            price,
            stock: stock || 1,
            categoryId,
            description,
            vendor: req.user._id,
            images,
        });

        res.status(201).json({ message: "Product added", listing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add product" });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) return res.status(404).json({ message: "Product not found" });
        if (!listing.vendor.equals(req.user._id))
            return res.status(403).json({ message: "Not authorized" });

        const { title, price, stock, categoryId, description } = req.body;
        const image = req.file;

        if (title) listing.title = title;
        if (price) listing.price = price;
        if (stock) listing.stock = stock;
        if (categoryId) listing.categoryId = categoryId;
        if (description) listing.description = description;

        if (image) listing.images = [`/uploads/${image.filename}`];

        await listing.save();
        res.json({ message: "Product updated", listing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update product" });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) return res.status(404).json({ message: "Product not found" });
        if (!listing.vendor.equals(req.user._id))
            return res.status(403).json({ message: "Not authorized" });

        // Delete image file if exists
        if (listing.images.length > 0) {
            listing.images.forEach((imgPath) => {
                const filePath = path.join("public", imgPath);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            });
        }

        await listing.deleteOne();
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete product" });
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

export const getVendorListings = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "User not found" });

        const listings = await Listing.find({ vendor: req.user._id })
            .populate("categoryId", "name")
            .sort({ createdAt: -1 });

        const response = listings.map((l) => ({
            ...l._doc,
            imageUrl: l.images[0] || "",
        }));

        res.json({ listings: response });
    } catch (err) {
        console.error("Error fetching vendor listings:", err);
        res.status(500).json({ message: "Server error" });
    }
};