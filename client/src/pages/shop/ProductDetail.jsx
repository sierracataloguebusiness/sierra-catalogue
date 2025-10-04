import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../component/Button.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          listingId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/shop" className="text-primary-gold underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/assets/placeholder.jpg"
            }
            alt={product.title}
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <p className="text-primary-gold font-bold text-2xl mb-6">
            ${product.price}
          </p>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`flex items-center gap-2 ${
              product.stock === 0 || adding
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-primary-gold text-black"
            }`}
          >
            <FaShoppingCart />{" "}
            {product.stock === 0
              ? "Unavailable"
              : adding
                ? "Adding..."
                : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
