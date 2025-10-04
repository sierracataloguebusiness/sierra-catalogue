import React from "react";
import Button from "../component/Button.jsx";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6">
      <h1 className="text-6xl font-bold text-primary-gold mb-4">404</h1>
      <p className="text-lg mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Button to="/">Back to Home</Button>
    </div>
  );
};

export default NotFound;
