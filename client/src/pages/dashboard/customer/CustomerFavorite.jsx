import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";
import ListingCard from "../../../component/ListingCard.jsx";

const CustomerFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) {
      toast.error("You must be logged in to view favorites.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        "https://sierra-catalogue.onrender.com/api/saved",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFavorites(res.data.savedListings || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      toast.error("Failed to load favorite listings.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      setRemovingId(listingId);
      const res = await axios.delete(
        `https://sierra-catalogue.onrender.com/api/saved/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message || "Removed from favorites");
      setFavorites(res.data.savedListings || []);
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Failed to remove from favorites.");
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <Loader />;

  if (favorites.length === 0)
    return (
      <div className="p-6 text-center text-gray-400">
        You have no favorite listings yet.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">Your Favorites</h1>
      <div className="grid justify-center items-center grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
        {favorites.map((listing) => (
          <div key={listing._id} className="relative">
            <ListingCard showFavorite={false} {...listing} />
            <button
              onClick={() => removeFavorite(listing._id)}
              disabled={removingId === listing._id}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm hover:bg-red-500 transition"
            >
              {removingId === listing._id ? "Removing..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerFavorite;
