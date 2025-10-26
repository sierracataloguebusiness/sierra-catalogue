import React, { useEffect, useState, useCallback } from "react";
import { FiSliders } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import ListingCard from "../../component/ListingCard.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../component/Loader.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const Shop = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gridLoading, setGridLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const limit = 20;

  const fetchListings = useCallback(
    async (query = "", categories = [], pageNum = 1) => {
      try {
        setGridLoading(true);
        const categoryQuery =
          categories.length > 0 ? `&categories=${categories.join(",")}` : "";
        const res = await axios.get(
          `${API_BASE}/listings?limit=${limit}&page=${pageNum}&search=${query}${categoryQuery}`,
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/category/`);
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, [fetchListings]);

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);
    fetchListings(search, updatedCategories, 1); // reset to page 1
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search, selectedCategories, 1); // reset to page 1
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

        <form onSubmit={handleSearch}>
          <input
            className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

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
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => handleCategoryChange(cat._id)}
                  className="size-5 accent-primary-gold"
                />
                {cat.name}
              </label>
            ))
          )}
        </div>
      </aside>

      {/* Mobile Filter Button */}
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

            <form
              onSubmit={(e) => {
                handleSearch(e);
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
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                      className="size-5 accent-primary-gold"
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
      <div className="container mx-auto px-4 py-10 flex flex-col gap-6">
        {gridLoading ? (
          <Loader />
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-400">No products available.</p>
        ) : (
          <>
            <div className="grid justify-center items-center grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} {...listing} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-700 disabled:opacity-50"
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
