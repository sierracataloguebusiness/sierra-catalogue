import React, { useEffect, useState } from "react";
import PageFlyer from "../../component/PageFlyer.jsx";
import BlogCard from "./BlogCard.jsx";
import axios from "axios";
import Loader from "../../component/Loader.jsx";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="mb-10">
      <PageFlyer
        heading="Catalogue Corner"
        subheading="From fashion, to tech, to all kinds of services get the latest information on the latest happening in the market."
        size="50"
      />
      <div className="flex max-lg:flex-col justify-between gap-6 px-4 container mx-auto">
        <div className="max-lg:text-center pt-10">
          <h2 className="heading mb-3">Latest Blog Post</h2>
          <p>Get the latest post on the undiscovered secrets of the market</p>
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
