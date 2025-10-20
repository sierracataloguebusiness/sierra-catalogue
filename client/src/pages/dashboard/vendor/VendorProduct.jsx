import React, { useState } from "react";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";

const VendorProduct = () => {
  const [form, setForm] = useState({
    title: "",
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

          <select>
            <option value="">Select Product</option>
            <option value="">Select Product</option>
            <option value="">Select Product</option>
            <option value="">Select Product</option>
          </select>
        </form>
      </div>
      {/*  edit products  */}
      {/*  view all products  */}
    </div>
  );
};
export default VendorProduct;
