import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-white bg-black">
      <h1 className="text-5xl font-bold mb-4">403</h1>
      <p className="text-lg mb-6">
        Access Denied – You don’t have permission to view this page.
      </p>
      <Link to="/" className="text-primary-gold hover:underline">
        Return Home
      </Link>
    </div>
  );
};

export default AccessDenied;
