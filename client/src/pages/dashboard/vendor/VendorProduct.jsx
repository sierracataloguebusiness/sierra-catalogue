import React, { useState } from "react";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../../component/Button.jsx";

const VendorProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: 1,
    category: "",
    image: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div>
      {/* upload product   */}
      <div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-3 max-w-2xl bg-gray-700 border border-gray-600 rounded-2xl p-6 sm:p-8 shadow-xl"
        >
          <h3 className="heading">Upload Products</h3>
          <FormInput
            placeholder="Product Name"
            hasLabel={false}
            onChange={handleChange}
            hasError={false}
            name={form.title}
            value={form.title}
          />

          <select
            value={form.category}
            name={form.category}
            onChange={handleChange}
            defaultValue=""
            className="bg-gray-800 text-white px-2 py-1 rounded-md"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="customer">Category 1</option>
            <option value="vendor">Category 2</option>
            <option value="admin">Category 3</option>
          </select>

          <FormInput
            placeholder="Price"
            hasLabel={false}
            onChange={handleChange}
            hasError={false}
            name={form.price}
            value={form.price}
          />

          <input type="file" accept="image/*" value={form.image} />

          <Button>Add Product</Button>
        </form>
      </div>
      {/*  edit products  */}
      {/*  view all products  */}
    </div>
  );
};
export default VendorProduct;
