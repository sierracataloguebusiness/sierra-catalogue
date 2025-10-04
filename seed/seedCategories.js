// seedCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

const categories = [
    {
        name: "Electronics",
        description: "Phones, laptops, gadgets, and accessories",
    },
    {
        name: "Fashion & Beauty",
        description: "Clothes, shoes, bags, watches, and cosmetics",
    },
    {
        name: "Food & Drinks",
        description: "Groceries, restaurant meals, beverages, and snacks",
    },
    {
        name: "Books & Stationery",
        description: "Textbooks, novels, pens, notebooks, and school supplies",
    },
    {
        name: "Home & Appliances",
        description: "Furniture, kitchenware, and small household electronics",
    },
    {
        name: "Health & Personal Care",
        description: "Toiletries, hygiene products, skincare, and first aid",
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected");

        // Clear old categories
        await Category.deleteMany();

        // Insert new categories
        await Category.insertMany(categories);

        console.log("Categories seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seed();