import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiSliders } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import ListingCard from "../../component/ListingCard.jsx";
import Loader from "../../component/Loader.jsx";
import CategoryFilter from "../../component/CategoryFilter.jsx";
import Pagination from "../../component/Pagination.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const Shop = () => {
  const [listings, setListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [gridLoading, setGridLoading] = useState(false);
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(search, selectedCategories, 1);
  };

  const handleCategoryChange = (updatedCategories) => {
    setSelectedCategories(updatedCategories);
    fetchListings(search, updatedCategories, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchListings(search, selectedCategories, newPage);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[49vh]">
      {/* Desktop Filter Sidebar */}
      <aside className="border-r border-gray-200 max-lg:hidden lg:w-1/4 p-6 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border border-gray-700 p-3 w-full rounded-md outline-none text-gray-200 placeholder-gray-400"
          />
        </form>

        <CategoryFilter
          selected={selectedCategories}
          onChange={handleCategoryChange}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3 border-b border-gray-700 bg-black/30 sticky top-[81px] z-50 backdrop-blur-sm">
        <h1 className="text-lg font-semibold text-white">Shop</h1>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm px-3 py-2 border border-gray-600 rounded-md text-gray-200"
        >
          <FiSliders /> Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50 transition">
          <div className="bg-neutral-900 w-3/4 sm:w-1/2 p-6 overflow-y-auto relative animate-slideIn">
            <IoClose
              onClick={() => setMobileFilterOpen(false)}
              className="absolute top-4 right-4 text-gray-300 size-6 cursor-pointer"
            />
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-100">
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
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border border-gray-700 p-3 outline-none w-full rounded-md text-gray-200 placeholder-gray-400"
              />
            </form>

            <CategoryFilter
              selected={selectedCategories}
              onChange={(updated) => {
                handleCategoryChange(updated);
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      <main className="flex-1 container mx-auto px-4 py-10">
        {gridLoading ? (
          <Loader />
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-400">
            No products available right now.
          </p>
        ) : (
          <>
            <div className="grid justify-center items-center grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} {...listing} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Shop;
