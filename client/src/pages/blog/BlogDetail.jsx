/**
 * BlogDetail.jsx
 * -----------------------------------------------------
 * Sierra Catalogue Blog Post Page
 *
 * Description:
 * Displays the blog post content.
 * Each page includes a title, read time, cover image, content
 *
 * Features:
 * - Fetches blog posts via Axios
 * - Displays Loader while content is being fetched or if it's not fetched
 *
 * Dependencies:
 * - React (for component logic)
 * - Axios (for HTTP requests)
 * - Loader (loading spinner)
 * - useParams (for getting the id parameter)
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../component/Loader.jsx";

const BlogDetail = () => {
  // =========================================================
  // STATE MANAGEMENT
  // =========================================================
  const { id } = useParams(); // Stores the id of the current page
  const [blog, setBlog] = useState(null); // Stores the current blog post

  // =========================================================
  // FETCH BLOG POST ON MOUNT
  // =========================================================
  useEffect(() => {
    /**
     * Fetches blog post from the backend API
     * Executes once when the component mounts.
     */
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          `https://sierra-catalogue.onrender.com/api/blogs/${id}`,
        );
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <Loader />;

  // =========================================================
  //️ RENDER BLOG DETAIL PAGE
  // =========================================================
  return (
    <div className="container mx-auto px-4 py-10">
      {/* ======================== BLOG DETAILS ======================== */}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-400 mb-2">{blog.readTime} min read</p>
      <img
        src={blog.coverImage || "/assets/blog-placeholder.jpg"}
        alt={blog.title}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />
      <p className="text-gray-200 leading-relaxed">{blog.content}</p>
    </div>
  );
};

export default BlogDetail;
