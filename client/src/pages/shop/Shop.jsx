import React, { useEffect, useState } from "react";
import { FiSliders } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch listings
  const fetchListings = async (query = "", categories = []) => {
    try {
      setLoading(true);
      const categoryQuery =
        categories.length > 0 ? `&categories=${categories.join(",")}` : "";
      const res = await axios.get(
        `https://sierra-catalogue.onrender.com/api/listings?limit=20&search=${query}${categoryQuery}`,
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
      const res = await axios.get(
        "https://sierra-catalogue.onrender.com/api/category/",
      );
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // Category selection
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

  // Add to cart
  const handleAddToCart = async (listingId) => {
    try {
      setAddingId(listingId);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "https://sierra-catalogue.onrender.com/api/cart/add",
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

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col lg:flex-row min-h-[49vh]">
      {/* Sidebar (Desktop) */}
      <aside className="border-r border-gray-700 max-lg:hidden lg:w-1/4 p-8 flex flex-col gap-6">
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
            className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md"
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
                  className="size-5 accent-primary-gold"
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

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-black/30 sticky top-[81px] z-20 backdrop-blur-sm">
        <h1 className="text-lg font-semibold">Shop</h1>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-700 rounded-md"
        >
          <FiSliders /> Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-30">
          <div className="bg-neutral-900 w-3/4 sm:w-1/2 p-6 overflow-y-auto relative">
            <IoClose
              onClick={() => setMobileFilterOpen(false)}
              className="absolute top-4 right-4 size-6 cursor-pointer"
            />
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiSliders /> Filters
            </h3>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchListings(search, selectedCategories);
                setMobileFilterOpen(false);
              }}
              className="mb-6"
            >
              <input
                className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md"
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* Categories */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm text-gray-400 uppercase font-medium">
                Categories
              </h4>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories available</p>
              ) : (
                categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2">
                    <input
                      className="size-5 accent-primary-gold"
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                    />
                    {cat.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Shop Content */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="heading text-center mb-8 hidden lg:block">Shop</h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-400">No products available.</p>
        ) : (
          <div className="grid justify-center items-center grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
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
