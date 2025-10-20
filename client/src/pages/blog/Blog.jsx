/**
 * Blog.jsx
 * -----------------------------------------------------
 * Sierra Catalogue Blog Page
 *
 * Description:
 * Displays the list of blog posts fetched from the backend API.
 * Each post includes its title, hook, and estimated reading time.
 * Also has a banner ("PageFlyer") introducing the blog section.
 *
 * Features:
 * - Fetches all published blog posts via Axios
 * - Displays Loader while content is being fetched
 * - Renders BlogCard components dynamically from fetched data
 *
 * Dependencies:
 * - React (for component logic) & React Icons
 * - Axios (for HTTP requests)
 * - PageFlyer (custom header/banner component)
 * - BlogCard (custom blog post card)
 * - Loader (loading spinner)
 */

import React, { useEffect, useState } from "react";
import PageFlyer from "../../component/PageFlyer.jsx";
import BlogCard from "./BlogCard.jsx";
import axios from "axios";
import Loader from "../../component/Loader.jsx";

const Blog = () => {
  // =========================================================
  // STATE MANAGEMENT
  // =========================================================
  const [blogs, setBlogs] = useState([]); // Stores fetched blog posts

  // =========================================================
  // FETCH BLOG POSTS ON MOUNT
  // =========================================================
  useEffect(() => {
    /**
     * Fetches all blog posts from the backend API.
     * Executes once when the component mounts.
     */
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          "https://sierra-catalogue.onrender.com/api/blogs",
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, []);

  // =========================================================
  // RENDER BLOG PAGE
  // =========================================================
  return (
    <div className="mb-10">
      {/* ======================== BLOG BANNER ======================== */}
      <PageFlyer
        heading="Catalogue Corner"
        subheading="From fashion to tech — get the latest market insights and stories."
        size="50"
      />

      {/* ======================== LATEST BLOG POST SECTION  ======================== */}
      <div className="flex max-lg:flex-col justify-between gap-6 px-4 container mx-auto">
        <div className="max-lg:text-center pt-10">
          <h2 className="heading mb-3">Latest Blog Post</h2>
          <p>Discover stories that inspire market innovation.</p>
        </div>
        <div className="flex flex-col flex-1">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <BlogCard
                key={blog._id}
                _id={blog._id}
                time={blog.readTime || "5"}
                blogTitle={blog.title}
                blogHook={blog.hook}
                border={index !== 0}
              />
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
