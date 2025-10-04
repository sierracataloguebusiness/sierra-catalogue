import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ _id, time, blogTitle, blogHook, border }) => {
  return (
    <div
      className={`p-4 flex flex-col gap-1.5 ${
        border ? "border-t border-gray-700" : ""
      } hover:bg-white/5 transition`}
    >
      <h3 className="text-lg font-semibold text-white">{blogTitle}</h3>
      <p className="text-gray-400 text-sm line-clamp-2">{blogHook}</p>
      <p className="text-sm text-gray-500">{time} min read</p>
      <Link
        to={`/blog/${_id}`}
        className="text-amber-400 text-sm font-medium hover:underline"
      >
        Read More →
      </Link>
    </div>
  );
};

export default BlogCard;
