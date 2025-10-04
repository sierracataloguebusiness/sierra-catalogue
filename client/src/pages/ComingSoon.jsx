import React from "react";
import { FaRegClock } from "react-icons/fa6";

const ComingSoon = ({
  title = "Coming Soon",
  message = "This page will be available after our MVP launch.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <FaRegClock className="w-16 h-16 text-primary-gold mb-4" />

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {title}
      </h1>

      <p className="text-gray-400 max-w-md">{message}</p>

      <p className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Sierra Catalogue
      </p>
    </div>
  );
};

export default ComingSoon;
