import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSliders } from "react-icons/fi";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const CategoryFilter = ({ selected = [], onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/category`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCheck = (id) => {
    const updated = selected.includes(id)
      ? selected.filter((c) => c !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FiSliders className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>

      <h4 className="text-sm text-gray-500 uppercase font-medium mb-3">
        Categories
      </h4>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400 text-sm">No categories available</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center gap-2 cursor-pointer hover:text-primary"
            >
              <input
                type="checkbox"
                checked={selected.includes(cat._id)}
                onChange={() => handleCheck(cat._id)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
