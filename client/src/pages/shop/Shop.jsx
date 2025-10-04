import React, { useEffect, useState } from "react";
import { FiSliders } from "react-icons/fi";
import ListingCard from "../../component/ListingCard.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../component/Loader.jsx";

const Shop = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [addingId, setAddingId] = useState(null);

  // Fetch listings with optional search and category filter
  const fetchListings = async (query = "", categories = []) => {
    try {
      setLoading(true);
      const categoryQuery =
        categories.length > 0 ? `&categories=${categories.join(",")}` : "";
      const res = await axios.get(
        `http://localhost:5000/api/listings?limit=20&search=${query}${categoryQuery}`,
      );
      setListings(res.data.listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category/");
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    let updatedCategories;
    if (selectedCategories.includes(categoryId)) {
      updatedCategories = selectedCategories.filter((c) => c !== categoryId);
    } else {
      updatedCategories = [...selectedCategories, categoryId];
    }
    setSelectedCategories(updatedCategories);
    fetchListings(search, updatedCategories);
  };

  // Add item to cart
  const handleAddToCart = async (listingId) => {
    try {
      setAddingId(listingId);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          listingId,
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
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-[49vh]">
      {/* Sidebar */}
      <aside className="border-r min-h-screen border-gray-700 max-lg:hidden lg:w-1/4 p-10 pr-20 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <FiSliders className="size-5" />
          <h3 className="text-2xl font-medium">Filters</h3>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchListings(search, selectedCategories);
          }}
        >
          <input
            className="bg-transparent border border-gray-700 p-3 outline-none w-full"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-gray-400 uppercase font-medium mt-3">
            Categories
          </h4>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories available</p>
          ) : (
            categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2">
                <input
                  className="size-5"
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => handleCategoryChange(cat._id)}
                />
                {cat.name}
              </label>
            ))
          )}
        </div>
      </aside>

      {/* Main Shop Content */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="heading text-center mb-8">Shop</h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-400">No products available.</p>
        ) : (
          <div className="justify-evenly items-center grid grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                id={listing._id}
                {...listing}
                onAddToCart={handleAddToCart}
                adding={addingId === listing._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
