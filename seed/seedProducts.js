// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

dotenv.config();

const products = {
    Electronics: [
        {
            title: "iPhone 13",
            price: 750,
            description: "128GB, Midnight Black",
            stock: 10,
            images: ["https://via.placeholder.com/300x200?text=iPhone+13"],
        },
        {
            title: "Samsung Galaxy A14",
            price: 300,
            description: "64GB, Awesome Silver",
            stock: 15,
            images: ["https://via.placeholder.com/300x200?text=Samsung+A14"],
        },
        {
            title: "HP Laptop 15",
            price: 650,
            description: "Core i5, 8GB RAM, 256GB SSD",
            stock: 8,
            images: ["https://via.placeholder.com/300x200?text=HP+Laptop"],
        },
        {
            title: "Bluetooth Headphones",
            price: 50,
            description: "Wireless over-ear headphones",
            stock: 20,
            images: ["https://via.placeholder.com/300x200?text=Headphones"],
        },
        {
            title: "Smart Watch",
            price: 120,
            description: "Fitness tracker with heart monitor",
            stock: 12,
            images: ["https://via.placeholder.com/300x200?text=Smart+Watch"],
        },
    ],
    "Fashion & Beauty": [
        {
            title: "Nike Air Max",
            price: 110,
            description: "Men’s running shoes",
            stock: 18,
            images: ["https://via.placeholder.com/300x200?text=Nike+Air+Max"],
        },
        {
            title: "Adidas Hoodie",
            price: 65,
            description: "Casual cotton hoodie",
            stock: 25,
            images: ["https://via.placeholder.com/300x200?text=Adidas+Hoodie"],
        },
        {
            title: "Gold Wristwatch",
            price: 250,
            description: "Luxury men’s watch",
            stock: 6,
            images: ["https://via.placeholder.com/300x200?text=Gold+Watch"],
        },
        {
            title: "Women’s Handbag",
            price: 80,
            description: "Leather crossbody bag",
            stock: 14,
            images: ["https://via.placeholder.com/300x200?text=Handbag"],
        },
        {
            title: "Makeup Kit",
            price: 40,
            description: "Complete beauty set",
            stock: 30,
            images: ["https://via.placeholder.com/300x200?text=Makeup+Kit"],
        },
    ],
    "Food & Drinks": [
        {
            title: "Fried Chicken Bucket",
            price: 25,
            description: "Family-size fried chicken",
            stock: 20,
            images: ["https://via.placeholder.com/300x200?text=Fried+Chicken"],
        },
        {
            title: "Pizza Margherita",
            price: 15,
            description: "Large cheese and tomato pizza",
            stock: 12,
            images: ["https://via.placeholder.com/300x200?text=Pizza"],
        },
        {
            title: "Coca-Cola Pack",
            price: 10,
            description: "6 x 500ml bottles",
            stock: 40,
            images: ["https://via.placeholder.com/300x200?text=CocaCola"],
        },
        {
            title: "Local Rice (50kg)",
            price: 45,
            description: "Premium Sierra Leonean rice",
            stock: 25,
            images: ["https://via.placeholder.com/300x200?text=Rice"],
        },
        {
            title: "Palm Oil (5L)",
            price: 30,
            description: "Organic palm oil",
            stock: 18,
            images: ["https://via.placeholder.com/300x200?text=Palm+Oil"],
        },
    ],
    "Books & Stationery": [
        {
            title: "Think and Grow Rich",
            price: 20,
            description: "By Napoleon Hill",
            stock: 30,
            images: ["https://via.placeholder.com/300x200?text=Think+and+Grow+Rich"],
        },
        {
            title: "Atomic Habits",
            price: 22,
            description: "By James Clear",
            stock: 15,
            images: ["https://via.placeholder.com/300x200?text=Atomic+Habits"],
        },
        {
            title: "Chinua Achebe - Things Fall Apart",
            price: 18,
            description: "Classic African literature",
            stock: 25,
            images: ["https://via.placeholder.com/300x200?text=Things+Fall+Apart"],
        },
        {
            title: "Local Exam Past Papers",
            price: 10,
            description: "WAEC & BECE past papers",
            stock: 50,
            images: ["https://via.placeholder.com/300x200?text=Past+Papers"],
        },
        {
            title: "The Lean Startup",
            price: 25,
            description: "By Eric Ries",
            stock: 10,
            images: ["https://via.placeholder.com/300x200?text=Lean+Startup"],
        },
    ],
    "Home & Appliances": [
        {
            title: "Sofa Set",
            price: 500,
            description: "3-piece living room sofa",
            stock: 5,
            images: ["https://via.placeholder.com/300x200?text=Sofa"],
        },
        {
            title: "Dining Table",
            price: 350,
            description: "Wooden 6-seater dining table",
            stock: 8,
            images: ["https://via.placeholder.com/300x200?text=Dining+Table"],
        },
        {
            title: "Bed Frame",
            price: 400,
            description: "King-size wooden frame",
            stock: 6,
            images: ["https://via.placeholder.com/300x200?text=Bed"],
        },
        {
            title: "Curtains",
            price: 60,
            description: "Luxury silk curtains",
            stock: 20,
            images: ["https://via.placeholder.com/300x200?text=Curtains"],
        },
        {
            title: "Gas Cooker",
            price: 220,
            description: "4-burner gas cooker",
            stock: 10,
            images: ["https://via.placeholder.com/300x200?text=Gas+Cooker"],
        },
    ],
    "Health & Personal Care": [
        {
            title: "Vitamin C Tablets",
            price: 12,
            description: "Immunity booster",
            stock: 50,
            images: ["https://via.placeholder.com/300x200?text=Vitamin+C"],
        },
        {
            title: "Body Lotion",
            price: 15,
            description: "Moisturizing lotion 500ml",
            stock: 30,
            images: ["https://via.placeholder.com/300x200?text=Body+Lotion"],
        },
        {
            title: "Hair Dryer",
            price: 45,
            description: "Compact electric hair dryer",
            stock: 12,
            images: ["https://via.placeholder.com/300x200?text=Hair+Dryer"],
        },
        {
            title: "Face Wash",
            price: 18,
            description: "Gentle cleansing formula",
            stock: 25,
            images: ["https://via.placeholder.com/300x200?text=Face+Wash"],
        },
        {
            title: "First Aid Kit",
            price: 35,
            description: "Complete home medical kit",
            stock: 15,
            images: ["https://via.placeholder.com/300x200?text=First+Aid"],
        },
    ],
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");

        await Listing.deleteMany();

        const vendor = await User.findOne();
        if (!vendor) {
            console.error("No vendor user found. Create at least one User first!");
            process.exit(1);
        }

        const categories = await Category.find();
        if (categories.length === 0) {
            console.error("No categories found. Seed categories first!");
            process.exit(1);
        }

        for (const category of categories) {
            const catProducts = products[category.name] || [];
            const formatted = catProducts.map((p) => ({
                ...p,
                categoryId: category._id,
                vendor: vendor._id,
            }));

            if (formatted.length > 0) {
                await Listing.insertMany(formatted);
                console.log(`Seeded ${formatted.length} products in ${category.name}`);
            }
        }

        console.log("Products seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seed();