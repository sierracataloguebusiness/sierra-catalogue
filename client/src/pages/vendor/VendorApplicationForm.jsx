import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import FormInput from "../../component/Form/FormComponents/FormInput.jsx";

const VendorApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    shopName: "",
    shopDescription: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        "https://sierra-catalogue.onrender.com/api/vendorApplications/apply",
        formData,
      );
      toast.success(res.data.message);
      setFormData({
        name: "",
        email: "",
        tel: "",
        shopName: "",
        shopDescription: "",
        address: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          Vendor Application Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-400">Full Name</label>
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <FormInput
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <FormInput
              type="tel"
              name="tel"
              placeholder="Phone Number"
              value={formData.tel}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <FormInput
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-400">Shop Description</label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 px-4 py-2 rounded-lg text-white h-24"
              placeholder="Tell us about your shop"
            />
          </div>

          <div>
            <FormInput
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-black border border-gray-700 px-4 py-2 rounded-lg text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg mt-4 transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorApplicationForm;
