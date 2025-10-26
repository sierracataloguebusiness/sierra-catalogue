import React, { useEffect, useState, useCallback } from "react";
import { FiSliders } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import ListingCard from "../../component/ListingCard.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../component/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Shop = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gridLoading, setGridLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchListings = useCallback(
    async (query = "", categories = [], pageNum = 1) => {
      try {
        setGridLoading(true);
        const categoryQuery =
          categories.length > 0 ? `&categories=${categories.join(",")}` : "";
        const res = await axios.get(
          `https://sierra-catalogue.onrender.com/api/listings?limit=${limit}&page=${pageNum}&search=${query}${categoryQuery}`,
        );
        setListings(res.data.listings || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.currentPage || 1);

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load products.");
      } finally {
        setGridLoading(false);
      }
    },
    [],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://sierra-catalogue.onrender.com/api/category/",
      );
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, [fetchCategories, fetchListings]);

  const handleSearchChange = debounce((value) => {
    fetchListings(value, selectedCategories, 1);
  }, 400);

  const handleCategoryChange = (categoryId) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updated);
    fetchListings(search, updated, 1);
  };

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
        { listingId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchListings(search, selectedCategories, newPage);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[49vh]">
      {/* Sidebar (Desktop) */}
      <aside className="border-r border-gray-700 max-lg:hidden lg:w-1/4 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <FiSliders className="size-5" />
          <h3 className="text-2xl font-medium">Filters</h3>
        </div>

        <input
          className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md"
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearchChange(e.target.value);
          }}
        />

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

      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-black/30 sticky top-[81px] z-60 backdrop-blur-sm">
        <h1 className="text-lg font-semibold">Shop</h1>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-700 rounded-md"
        >
          <FiSliders /> Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-30"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-neutral-900 w-3/4 sm:w-1/2 p-6 overflow-y-auto relative"
            >
              <IoClose
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-4 right-4 size-6 cursor-pointer"
              />
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiSliders /> Filters
              </h3>

              <input
                className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md mb-6"
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearchChange(e.target.value);
                }}
              />

              <div className="flex flex-col gap-3">
                <h4 className="text-sm text-gray-400 uppercase font-medium">
                  Categories
                </h4>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No categories available
                  </p>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid with Pagination */}
      <div className="container mx-auto px-4 py-10">
        <h1 className="heading text-center mb-8 hidden lg:block">Shop</h1>

        {gridLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-400">No products available.</p>
        ) : (
          <>
            <motion.div
              layout
              className="grid justify-center items-center grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6"
            >
              <AnimatePresence>
                {listings.map((listing) => (
                  <motion.div
                    key={listing._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListingCard
                      id={listing._id}
                      {...listing}
                      onAddToCart={handleAddToCart}
                      adding={addingId === listing._id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8 text-white">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-700 transition"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
