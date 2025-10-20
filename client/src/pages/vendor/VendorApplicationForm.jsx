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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value) => {
    if (/^0\d{8}$/.test(value)) {
      return "+232" + value.slice(1);
    }
    if (/^\+232\d{8}$/.test(value)) {
      return value;
    }
    return value;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.tel.trim()) {
      newErrors.tel = "Phone number is required";
    } else if (!/^\+232\d{8}$/.test(formData.tel)) {
      newErrors.tel = "Invalid phone number";
    }

    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required";
    if (!formData.shopDescription.trim())
      newErrors.shopDescription = "Shop description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "tel") {
      value = formatPhoneNumber(value);
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTel = formatPhoneNumber(formData.tel);
    const updatedData = { ...formData, tel: formattedTel };

    setFormData(updatedData);

    if (!validateForm()) {
      toast.error("Please fix the highlighted errors.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://sierra-catalogue.onrender.com/api/vendorApplication/apply",
        updatedData,
      );
      toast.success(res.data.message || "Application submitted successfully!");

      setFormData({
        name: "",
        email: "",
        tel: "",
        shopName: "",
        shopDescription: "",
        address: "",
      });
      setErrors({});
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to submit application";
      toast.error(message);
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

        <form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <FormInput
            type="tel"
            name="tel"
            placeholder="Phone Number"
            value={formData.tel}
            onChange={handleChange}
            error={errors.tel}
          />

          <FormInput
            type="text"
            name="shopName"
            placeholder="Shop Name"
            value={formData.shopName}
            onChange={handleChange}
            error={errors.shopName}
          />

          <div>
            <label className="block mb-1">Shop Description</label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              className={`w-full bg-black border rounded-lg px-4 py-2 text-white h-24 focus:outline-none focus:border-yellow-400 ${
                errors.shopDescription ? "border-red-500" : "border-gray-700"
              }`}
              placeholder="Tell us about your shop"
            />
            {errors.shopDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shopDescription}
              </p>
            )}
          </div>

          <FormInput
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg mt-4 transition ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorApplicationForm;
