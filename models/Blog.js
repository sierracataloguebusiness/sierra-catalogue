import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    hook: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readTime: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;