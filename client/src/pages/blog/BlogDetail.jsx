import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
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
