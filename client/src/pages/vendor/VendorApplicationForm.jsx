import React, { useState } from "react";
import FormInput from "../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../component/Button.jsx";

const VendorApplicationForm = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vendor Application Submitted:", formData);
    alert("Your application has been submitted! We will contact you soon.");
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="bg-white/5 rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-primary-gold mb-6">
          Vendor Application Form
        </h1>
        <p className="mb-6 text-center">
          Please fill in your details to apply as a vendor on Sierra Catalogue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="text"
            name="name"
            placeholder="Full Name"
            hasError={false}
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <FormInput
            type="tel"
            name="phone"
            value={formData.phone}
            hasError={false}
            onChange={handleChange}
            required={true}
            placeholder="Phone Number"
          />

          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            hasError={false}
            value={formData.email}
            onChange={handleChange}
            required={true}
          />

          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VendorApplicationForm;
