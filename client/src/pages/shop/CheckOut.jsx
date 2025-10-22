import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../component/Button.jsx";
import { toast } from "react-toastify";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [delivery, setDelivery] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    method: "delivery",
    address: "",
    instructions: "",
  });

  const navigate = useNavigate();
  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.listingId?.price ?? 0) * (item.quantity ?? 0),
    0,
  );

  const placeOrder = async () => {
    if (!delivery.firstName || !delivery.phone) {
      toast.error("Please provide your First Name and Phone Number");
      return;
    }

    setProcessing(true);
    try {
      const token = getToken();
      await axios.post(
        `${API_BASE}/order/create`,
        {
          items: cartItems.map((e) => ({
            listingId: e.listingId?._id,
            title: e.listingId?.title,
            price: e.listingId?.price,
            quantity: e.quantity,
          })),
          delivery,
          total: subtotal,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(
        "Order placed successfully! The vendor will contact you to arrange payment.",
      );
      setCartItems([]);
      navigate("/ordersuccess");
    } catch (err) {
      console.error("Order placement failed:", err.response ?? err.message);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading checkout...</p>;

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      {/* Progress Steps */}
      <div className="flex justify-center gap-6 mb-10">
        {["Review Order", "Delivery Details"].map((label, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              step === index + 1 ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                step === index + 1
                  ? "bg-yellow-400 text-black"
                  : "border-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Review Order */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-400">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border border-gray-700 p-4 mb-3 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{item.listingId?.title}</h3>
                  <p className="text-gray-400">
                    NLe {item.listingId?.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold">
                  NLe {(item.listingId?.price ?? 0) * (item.quantity ?? 0)}
                </p>
              </div>
            ))
          )}

          <div className="flex justify-between font-semibold mt-6">
            <span>Subtotal</span>
            <span>NLe {subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={cartItems.length === 0}
            className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-300"
          >
            Continue to Delivery
          </button>
        </div>
      )}

      {/* Step 2: Delivery Details */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={delivery.firstName}
              onChange={(e) =>
                setDelivery({ ...delivery, firstName: e.target.value })
              }
              className="border border-gray-600 p-3 rounded bg-transparent"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={delivery.lastName}
              onChange={(e) =>
                setDelivery({ ...delivery, lastName: e.target.value })
              }
              className="border border-gray-600 p-3 rounded bg-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={delivery.phone}
              onChange={(e) =>
                setDelivery({ ...delivery, phone: e.target.value })
              }
              className="border border-gray-600 p-3 rounded bg-transparent"
            />

            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={delivery.method === "delivery"}
                  onChange={() =>
                    setDelivery({ ...delivery, method: "delivery" })
                  }
                />{" "}
                Delivery
              </label>
              <label>
                <input
                  type="radio"
                  checked={delivery.method === "pickup"}
                  onChange={() =>
                    setDelivery({ ...delivery, method: "pickup" })
                  }
                />{" "}
                Pickup
              </label>
            </div>

            {delivery.method === "delivery" && (
              <input
                type="text"
                placeholder="Delivery Address"
                value={delivery.address}
                onChange={(e) =>
                  setDelivery({ ...delivery, address: e.target.value })
                }
                className="border border-gray-600 p-3 rounded bg-transparent"
              />
            )}

            <textarea
              placeholder="Additional Instructions (Optional)"
              value={delivery.instructions}
              onChange={(e) =>
                setDelivery({ ...delivery, instructions: e.target.value })
              }
              className="border border-gray-600 p-3 rounded bg-transparent"
            ></textarea>
          </div>

          <div className="flex justify-between font-semibold mt-6">
            <span>Total</span>
            <span>NLe {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              style="secondary"
              onClick={() => setStep(1)}
              className="w-1/2 bg-gray-500 py-3 rounded-lg hover:bg-gray-400"
            >
              Back to Cart
            </Button>
            <Button
              onClick={placeOrder}
              disabled={processing}
              className="w-1/2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-400"
            >
              {processing ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
