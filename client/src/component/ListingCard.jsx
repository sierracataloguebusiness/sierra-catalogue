import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button.jsx";
import logo from "/src/assets/Sierra Catalogue Logo.jpg";

const ListingCard = ({ title, description, price, images, stock, id }) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          listingId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-72 h-[464px] relative border border-gray-700 bg-white/5 backdrop-blur-sm p-4 flex flex-col shadow-md hover:shadow-lg transition">
      {/* Image */}
      <div className="relative w-full h-48 mb-4">
        <img
          src={images && images.length > 0 ? images[0] : logo}
          alt={title}
          className="w-full h-[288px] object-cover object-center rounded-xl"
        />
        {stock === 0 && (
          <span className="fixed top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-white mb-1 h-6">{title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-2 h-10">
        {description}
      </p>
      <p className="text-primary-gold font-medium text-lg mb-4">Nle {price}</p>

      {/* Actions */}
      <div className="w-full grid grid-rows-2 justify-between gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={stock === 0 || adding}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition cursor-pointer ${
            stock === 0 || adding
              ? "bg-gray-500 text-gray-300"
              : "bg-primary-gold text-black"
          }`}
        >
          <FaShoppingCart />{" "}
          {stock === 0 ? "Pre-order" : adding ? "Adding..." : "Add to Cart"}
        </Button>

        <Link to={`/shop/product/${id}`}>
          <Button
            style="secondary"
            disabled={stock === 0}
            className={`flex items-center justify-center gap-2 rounded-xl cursor-pointer ${
              stock === 0
                ? "bg-gray-500 text-gray-300"
                : "bg-primary-gold text-black"
            }`}
          >
            <FaShoppingCart /> View more
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
