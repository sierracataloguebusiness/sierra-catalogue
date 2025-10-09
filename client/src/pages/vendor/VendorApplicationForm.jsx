import React, { useState } from "react";
import FormInput from "../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../component/Button.jsx";
import { toast } from "react-toastify";

const VendorApplicationForm = () => {
  const [formData, setFormData] = useState({ name: "", tel: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.tel.trim()) newErrors.tel = "Phone number is required.";
    else if (!/^(0\d{8}|\+232\d{8})$/.test(formData.tel))
      newErrors.tel = "Phone must be 099XXXXXX or +2329XXXXXXX.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Please fix the highlighted errors.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://sierra-catalogue.onrender.com/api/post-vendor-application",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Your application has been submitted successfully!");
      setFormData({ name: "", tel: "", email: "" });
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit application. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="bg-white/5 rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-primary-gold mb-6">
          Vendor Application Form
        </h1>
        <p className="mb-6 text-center text-gray-300">
          Please fill in your details to apply as a vendor on Sierra Catalogue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            hasError={true}
            required
          />

          <FormInput
            type="tel"
            name="tel"
            placeholder="Phone Number"
            value={formData.tel}
            onChange={handleChange}
            error={errors.tel}
            hasError={true}
            required
          />

          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            hasError={true}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VendorApplicationForm;
