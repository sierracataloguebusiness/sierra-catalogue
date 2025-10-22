import React, { useState } from "react";
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
  const [showImageField, setShowImageField] = useState(false);

  if (!show) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) =>
    e.target.files[0] &&
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={() => {
            onClose();
            setShowImageField(false);
          }}
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-4 text-primary-gold">
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

          <select
            name="categoryId"
            value={form.categoryId || ""}
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

          {editing && form.currentImage && !showImageField && (
            <div className="flex items-center gap-3">
              <img
                src={form.currentImage}
                alt="Current"
                className="w-24 h-24 object-cover rounded-lg border border-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowImageField(true)}
                className="text-sm underline hover:text-primary-gold"
              >
                Edit product photo
              </button>
            </div>
          )}

          {editing && showImageField && (
            <button
              type="button"
              onClick={() => setShowImageField(false)}
              className="text-sm underline hover:text-primary-gold"
            >
              Keep current photo
            </button>
          )}

          {(!editing || showImageField) && (
            <div className="flex flex-col-reverse space-y-2">
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
                  className="w-32 h-32 object-cover rounded-lg border border-gray-600 mt-2"
                />
              )}
            </div>
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
