import React from "react";
import FormInput from "../component/Form/FormComponents/FormInput.jsx";
import Button from "../component/Button.jsx";

const ProductModal = ({
  show,
  onClose,
  onSubmit,
  form,
  setForm,
  editing,
  categories,
  loading,
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">
          {editing ? "Edit Product" : "Add Product"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            type="text"
            name="title"
            placeholder="Product Name"
            value={form.title}
            onChange={handleChange}
            hasLabel={false}
          />

          <FormInput
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            hasLabel={false}
          />

          <FormInput
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            hasLabel={false}
          />

          <FormInput
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            hasLabel={false}
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

          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" onClick={onClose}>
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
  );
};

export default ProductModal;
