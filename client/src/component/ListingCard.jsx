import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const ListingCard = ({
  id,
  title,
  price,
  images = [],
  category,

  token,
  showFavorite = true,
}) => {
  const location = useLocation();
  const isFavoritesPage = location.pathname.includes("/favorites");

  const [favorited, setFavorited] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Login to save favorites.");

    try {
      setFavorited((prev) => !prev);
      await axios.post(
        `https://sierra-catalogue.onrender.com/api/saved/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(
        favorited ? "Removed from favorites" : "Added to favorites",
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites.");
      setFavorited((prev) => !prev);
    }
  };

  const handleAddToCart = async () => {
    if (!token) return toast.error("Login to add items to cart.");

    try {
      setAdding(true);
      await axios.post(
        `https://sierra-catalogue.onrender.com/api/cart`,
        { listingId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-transform transform hover:scale-105 duration-300 overflow-hidden group relative cursor-pointer">
      {/* Image */}
      <div className="relative h-48 w-full">
        <img
          src={images?.[0] || "/placeholder.jpg"}
          alt={title}
          className="object-cover w-full h-full"
        />

        {/* Favorite icon (hidden on favorites page) */}
        {!isFavoritesPage && showFavorite && (
          <button
            onClick={handleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition ${
              favorited
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{category}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">${price}</p>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/80 transition disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
