import React, { useState } from "react";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";

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

  return (
    <div>
      {/* upload product   */}
      <div>
        <h3 className="heading text-prim">Upload Products</h3>

        <form>
          <FormInput
            placeholder="Product Name"
            hasLabel={false}
            onChange={handleChange}
            hasError={false}
            name="productName"
            value={form.title}
          />

          <select
            value={form.category}
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
            name="price"
            value={form.price}
          />

          <FormInput
            placeholder="Stock"
            hasLabel={false}
            onChange={handleChange}
            hasError={false}
            name="stock"
            value={form.stock}
          />

          <input type={"image"} value={form.image} />
        </form>
      </div>
      {/*  edit products  */}
      {/*  view all products  */}
    </div>
  );
};
export default VendorProduct;
