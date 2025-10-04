import express from "express";
import {createBlogPost, getBlogPost, getBlogPosts} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogPosts);
router.get("/:id", getBlogPost);
router.post("/", createBlogPost);

export default router;