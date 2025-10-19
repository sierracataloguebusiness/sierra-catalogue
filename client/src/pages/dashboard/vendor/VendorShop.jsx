import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";
import { toast } from "react-toastify";

const VendorShop = () => {
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    logo: "",
    banner: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await axios.get("/api/vendor/shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShop(res.data.shop);
        setFormData(res.data.shop);
      } catch (err) {
        console.log(err);
      }
    };
    fetchShop();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/vendor/shop", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
      setShop(res.data.shop);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6 text-amber-400">My Shop</h1>

      {shop ? (
        <div className="bg-gray-800 p-5 rounded-xl text-white shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              name="name"
              placeholder="Shop Name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormInput
              type="text"
              name="description"
              placeholder="Shop Description"
              value={formData.description}
              onChange={handleChange}
            />
            <FormInput
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded-xl transition"
            >
              {loading ? "Saving..." : "Save Shop Info"}
            </button>
          </form>

          <div className="mt-6">
            <p>
              <strong>Status:</strong> {shop.status}
            </p>
            <p>
              <strong>Total Products:</strong> {shop.totalProducts}
            </p>
            <p>
              <strong>Total Orders:</strong> {shop.totalOrders}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">You have not set up your shop yet.</p>
      )}
    </div>
  );
};

export default VendorShop;
