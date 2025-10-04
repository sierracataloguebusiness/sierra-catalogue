import mongoose from "mongoose";
import dotenv from "dotenv";
import Blog from "../models/Blog.js";

dotenv.config();

const blogs = [
    {
        title: "Sierra Catalogue, the Future of Online Shopping in Sierra Leone",
        hook: "From fashion to electronics, buyers want an easier, faster way to not only find, but acquire trusted products. Sierra Catalogue brings everything in one platform - with categories, deals, and a safe listing system.",
        content:
            "Sierra Catalogue is transforming the online shopping landscape in Sierra Leone by providing a reliable and user-friendly marketplace. Buyers can easily browse categories, access the best deals, and vendors get tools to boost their sales. With growing internet penetration, the future of shopping is digital, and Sierra Catalogue is at the forefront.",
        readTime: 4,
        coverImage: "https://via.placeholder.com/800x400.png?text=Sierra+Catalogue",
    },
    {
        title: "5 Tips for Selling Faster on Sierra Catalogue",
        hook: "Standing out in a growing online marketplace is easier than you think.",
        content:
            "Want to sell your products faster? Here are 5 tips: 1) Use clear product images, 2) Write honest, detailed descriptions, 3) Keep your prices competitive, 4) Update stock regularly, and 5) Respond quickly to customer inquiries. Following these tips will improve your visibility and help you win more customers.",
        readTime: 3,
        coverImage: "https://via.placeholder.com/800x400.png?text=Sell+Faster",
    },
    {
        title: "3 Categories Sierra Leoneans Love Shopping for Online",
        hook: "Ever wondered what are the top categories which people are buying the most online? We've got the answers.",
        content:
            "Based on our data, the top 3 categories Sierra Leoneans love to shop for online are: 1) Electronics & Mobile Phones, 2) Fashion & Accessories, and 3) Food & Groceries. As convenience becomes a priority, these categories are seeing massive growth. Vendors who specialize in these areas are likely to gain more traction.",
        readTime: 5,
        coverImage: "https://via.placeholder.com/800x400.png?text=Top+Categories",
    },
];

const seedBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Blog.deleteMany();
        await Blog.insertMany(blogs);
        console.log("Blog posts seeded successfully");
        process.exit();
    } catch (error) {
        console.error("Error seeding blogs:", error);
        process.exit(1);
    }
};

seedBlogs();