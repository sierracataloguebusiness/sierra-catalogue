// VendorProduct.jsx (updated)
import React, { useEffect, useState } from "react";
import Button from "../../../component/Button.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";
import ProductModal from "../../../modal/ProductModal.jsx";

const DeleteModal = ({ visible, onConfirm, onCancel, message }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center">
        <p className="mb-4">{message || "Are you sure you want to delete?"}</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-red-600" onClick={onConfirm}>
            Delete
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

const VendorProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: 1,
    categoryId: "",
    description: "",
    image: null,
    currentImage: null,
    isActive: true,
  });
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const CATEGORY_MAP = {
    "68d9879b81bc7c3a62f903f3": { name: "Electronics" },
    "68d9879b81bc7c3a62f903f4": { name: "Fashion & Beauty" },
    "68d9879b81bc7c3a62f903f5": { name: "Food & Drinks" },
    "68d9879b81bc7c3a62f903f6": { name: "Books & Stationery" },
    "68d9879b81bc7c3a62f903f7": { name: "Home & Appliances" },
    "68d9879b81bc7c3a62f903f8": { name: "Health & Personal Care" },
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://sierra-catalogue.onrender.com/api/category"),
          axios.get(
            "https://sierra-catalogue.onrender.com/api/vendor/listings",
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ]);
        setCategories(catRes.data.categories || []);
        setProducts(prodRes.data.listings || []);
      } catch (err) {
        toast.error(
          `Failed to load data: ${err.response?.data?.message || err.message}`,
        );
      } finally {
        setProductLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      stock: 1,
      categoryId: "",
      description: "",
      image: null,
      currentImage: null,
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
      formData.append("stock", Number(form.stock || 0));
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);

      if (form.image) {
        if (Array.isArray(form.image)) {
          form.image.forEach((img) => formData.append("images", img));
        } else {
          formData.append("images", form.image);
        }
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editing) {
        await axios.put(
          `https://sierra-catalogue.onrender.com/api/listings/${editing}`,
          formData,
          config,
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(
          "https://sierra-catalogue.onrender.com/api/listings/",
          formData,
          config,
        );
        toast.success("Product added successfully!");
      }

      const updated = await axios.get(
        "https://sierra-catalogue.onrender.com/api/vendor/listings",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProducts(updated.data.listings || []);

      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Action failed, check console for details",
      );
      console.error("Submit error:", err);
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
      currentImage: product.images?.[0] || null,
    });
    setShowModal(true);
  };

  const confirmDelete = (id) => setDeleteId(id);
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(
        `https://sierra-catalogue.onrender.com/api/listings/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  if (productLoading) return <Loader />;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary-gold">My Products</h1>
        <Button onClick={() => setShowModal(true)}>Add Product</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700">
        {products.length === 0 ? (
          <p className="text-gray-400 p-4 text-center">No products yet.</p>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-300">
            <thead className="bg-gray-900 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Price (NLe)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-700 hover:bg-gray-800/60 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-white truncate max-w-[180px]">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {CATEGORY_MAP[p.categoryId]?.name || "Uncategorized"}
                  </td>
                  <td className="px-4 py-3 max-w-[250px] text-gray-400 truncate relative group">
                    <span>{p.description || "—"}</span>
                    <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded-lg shadow-lg w-64 top-full left-0 mt-2 z-50">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        className="bg-gray-700 hover:bg-gray-600"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-500"
                        onClick={() => confirmDelete(p._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProductModal
        show={showModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editing={editing}
        categories={categories}
        loading={loading}
      />

      <DeleteModal
        visible={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default VendorProduct;
