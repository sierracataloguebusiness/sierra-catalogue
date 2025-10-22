import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../../component/Button.jsx";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";

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
  const [pageLoading, setPageLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchShop = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get("/api/vendor/shop", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShop(res.data.shop);
        if (res.data.shop) setFormData(res.data.shop);
      } catch (err) {
        console.log(err);
      } finally {
        setPageLoading(false);
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
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving shop");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupClick = () => setShowForm(true);

  if (pageLoading) return <Loader />;
  return (
    <div className="p-6">
      <h1 className="heading font-bold mb-6 text-amber-400">My shop</h1>

      {shop || showForm ? (
        <div className="bg-gray-800 p-5 rounded-xl text-white max-w-2xl">
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

          {shop && (
            <div className="mt-6">
              <p>
                <strong>Status:</strong> {shop.status}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-gray-400">You have not set up your shop yet.</p>
          <Button
            onClick={handleSetupClick}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-xl"
          >
            Set Up Shop
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorShop;
