import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import Button from "../../component/Button.jsx";

const API_BASE = "http://localhost:5000/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Cart fetch response:", res.data);

      const items = Array.isArray(res.data?.cart?.items)
        ? res.data.cart.items
        : [];
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err.response ?? err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = item.listingId?.price ?? 0;
    const qty = item.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  const removeFromCart = async (listingId) => {
    try {
      const token = getToken();
      const res = await axios.delete(`${API_BASE}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { listingId },
      });

      const items = Array.isArray(res.data?.cart?.items)
        ? res.data.cart.items
        : [];
      setCartItems(items);
    } catch (err) {
      console.error("Error removing item:", err.response ?? err.message);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (listingId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(listingId);
    try {
      const token = getToken();
      const res = await axios.put(
        `${API_BASE}/cart/update`,
        { listingId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const items = Array.isArray(res.data?.cart?.items)
        ? res.data.cart.items
        : [];
      setCartItems(items);
    } catch (err) {
      console.error("Error updating quantity:", err.response ?? err.message);
      alert(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center py-10">Loading cart...</p>;

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="heading mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid gap-4">
            {cartItems.map((item) => {
              const listing = item.listingId || {};
              const listingId = listing._id;
              return (
                <div
                  key={item._id ?? listingId}
                  className="flex gap-4 items-center border border-gray-700 bg-white/5 p-4"
                >
                  <img
                    src={
                      Array.isArray(listing.images) && listing.images.length > 0
                        ? listing.images[0]
                        : "/assets/placeholder.jpg"
                    }
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {listing.title || "Untitled"}
                    </h3>
                    <p className="text-gray-400 font-medium text-sm">
                      Nle {listing.price ?? 0}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(listingId, (item.quantity ?? 1) - 1)
                        }
                        disabled={
                          updatingId === listingId || (item.quantity ?? 1) <= 1
                        }
                        className="px-2 py-1 bg-gray-800 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(listingId, (item.quantity ?? 1) + 1)
                        }
                        disabled={updatingId === listingId}
                        className="px-2 py-1 bg-gray-800 rounded"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(listingId)}
                        className="ml-4 text-sm text-amber-400"
                      >
                        <FaRegTrashCan className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <hr className="mt-16" />
          <div className="flex flex-col gap-2 mt-6 text-right">
            <p className="text-lg flex items-center justify-between">
              Subtotal:{" "}
              <span className="font-bold">Nle {total.toFixed(2)}</span>
            </p>
            <Button to="/checkout" className="px-6 py-3 font-medium">
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
