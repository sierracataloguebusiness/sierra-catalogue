import React, { useEffect, useState } from "react";
import FormInput from "../../../component/Form/FormComponents/FormInput.jsx";
import Button from "../../../component/Button.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const VendorProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: 1,
    categoryId: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://sierra-catalogue.onrender.com/api/category",
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Unable to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.categoryId || !form.image) {
      toast.error("All required fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock) || 0);
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      formData.append("image", form.image);

      const token = localStorage.getItem("token");

      await axios.post(
        "https://sierra-catalogue.onrender.com/api/listings/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Product added successfully!");
      setForm({
        title: "",
        price: "",
        stock: 1,
        categoryId: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
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
          placeholder="Description"
          name="description"
          value={form.description}
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
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white"
        />

        {form.image && (
          <img
            src={URL.createObjectURL(form.image)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-600"
          />
        )}

        <Button type="submit">
          {loading ? "Uploading..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default VendorProduct;
