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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://sierra-catalogue.onrender.com/api/category"),
          axios.get(
            "https://sierra-catalogue.onrender.com/api/listings/vendor",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);
        setCategories(catRes.data.categories || []);
        console.log(prodRes.data.listings);
        setProducts(prodRes.data.listings || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vendor data");
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      stock: 1,
      categoryId: "",
      description: "",
      image: null,
    });
    setEditing(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", Number(form.price));
      formData.append("stock", Number(form.stock));
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      if (editing) {
        await axios.put(
          `https://sierra-catalogue.onrender.com/api/listings/${editing}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Product updated successfully!");
      } else {
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
      }

      resetForm();

      const updated = await axios.get(
        "https://sierra-catalogue.onrender.com/api/listings/vendor",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProducts(updated.data.listings || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      title: product.title,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId?._id || "",
      description: product.description,
      image: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `https://sierra-catalogue.onrender.com/api/listings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button onClick={() => setShowModal(true)}>Add Product</Button>
      </div>

      {/* Product Grid */}
      {/*<div className="grid md:grid-cols-3 gap-6">*/}
      {/*  {products.length === 0 ? (*/}
      {/*    <p className="text-gray-400">No products yet.</p>*/}
      {/*  ) : (*/}
      {/*    products.map((p) => (*/}
      {/*      <div*/}
      {/*        key={p._id}*/}
      {/*        className="bg-gray-800 rounded-xl p-4 flex flex-col items-center border border-gray-700"*/}
      {/*      >*/}
      {/*        <img*/}
      {/*          src={p.imageUrl}*/}
      {/*          alt={p.title}*/}
      {/*          className="w-40 h-40 object-cover rounded-lg mb-3"*/}
      {/*        />*/}
      {/*        <h3 className="font-semibold">{p.title}</h3>*/}
      {/*        <p className="text-sm text-gray-400">{p.description}</p>*/}
      {/*        <p className="mt-1 font-bold">${p.price}</p>*/}
      {/*        <div className="flex gap-2 mt-3">*/}
      {/*          <Button onClick={() => handleEdit(p)}>Edit</Button>*/}
      {/*          <Button*/}
      {/*            onClick={() => handleDelete(p._id)}*/}
      {/*            className="bg-red-600"*/}
      {/*          >*/}
      {/*            Delete*/}
      {/*          </Button>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  )}*/}
      {/*</div>*/}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={resetForm}
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editing ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 mx-2">
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
                placeholder="Stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                hasLabel={false}
                hasError={false}
              />

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="bg-gray-900 text-white px-3 py-2 rounded-md outline-none w-full"
              >
                <option value="">Select Category</option>
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

              <div className="flex gap-3 justify-end">
                <Button type="button" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {loading
                    ? "Saving..."
                    : editing
                      ? "Update Product"
                      : "Add Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProduct;
