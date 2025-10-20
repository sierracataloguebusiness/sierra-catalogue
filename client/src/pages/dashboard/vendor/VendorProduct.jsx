import React, { useState } from "react";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../../component/Button.jsx";

const VendorProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: 1,
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col space-y-4 max-w-2xl bg-gray-700 border border-gray-600 rounded-2xl p-6 sm:p-8 shadow-xl"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          Upload Product
        </h3>

        <FormInput
          placeholder="Product Name"
          name="title"
          value={form.title}
          onChange={handleChange}
          hasLabel={false}
          hasError={false}
        />

        <FormInput
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          hasLabel={false}
          hasError={false}
        />

        <FormInput
          placeholder="Stock Quantity"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          hasLabel={false}
          hasError={false}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
          <option value="category3">Category 3</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />

        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
};

export default VendorProduct;
