import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button.jsx";
import logo from "/src/assets/Sierra Catalogue Logo.jpg";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const ListingCard = ({ title, description, price, images, stock, id }) => {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedIds = res.data.savedListings?.map((l) => l._id) || [];
        setIsSaved(savedIds.includes(id));
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };
    fetchSaved();
  }, [id, token]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        `${API_BASE}/cart/add`,
        { listingId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleSave = async () => {
    if (!token) {
      toast.error("You must be logged in to save items.");
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await axios.delete(`${API_BASE}/saved/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info("Removed from saved listings.");
      } else {
        await axios.post(
          `${API_BASE}/saved/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Listing saved!");
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Save toggle error:", err);
      toast.error("Failed to update saved status.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-64 -z-10 h-auto border border-gray-800 bg-black/30 backdrop-blur-md p-4 flex flex-col rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative w-full h-48 mb-4">
        <img
          src={images && images.length > 0 ? images[0] : logo}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
        />
        {stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
            Out of Stock
          </span>
        )}

        <button
          onClick={handleToggleSave}
          disabled={saving}
          className={`absolute top-2 left-2 p-2 rounded-full ${
            isSaved ? "bg-red-600 text-white" : "bg-gray-700 text-gray-200"
          } hover:bg-red-500 transition`}
        >
          <FaHeart />
        </button>
      </div>

      {/* Text Info */}
      <h3 className="text-headline font-semibold text-white mb-1 truncate">
        {title}
      </h3>
      <p className="text-body text-gray-300 line-clamp-2 mb-3">{description}</p>
      <p className="text-primary-gold font-semibold text-lg mb-4">
        Nle {price}
      </p>

      {/* Buttons */}
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
