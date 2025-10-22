import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../component/Button.jsx";
import { toast } from "react-toastify";
import Loader from "../../component/Loader.jsx";

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
    if (!delivery.firstName || !delivery.lastName) {
      toast.error("Please provide your First and Last Name");
      return;
    }

    if (!delivery.phone) {
      toast.error("Please provide your phone number");
      return;
    }

    if (!delivery.address) {
      toast.error("Please provide your Address");
      return;
    }

    setProcessing(true);

    try {
      const token = getToken();

      const orderRes = await axios.post(
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

      if (orderRes.status === 200 || orderRes.status === 201) {
        try {
          await axios.delete(`${API_BASE}/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (clearErr) {
          console.warn(
            "⚠️ Order placed but cart not cleared:",
            clearErr.message,
          );
        }

        setCartItems([]);
        toast.success(
          "Order placed successfully! The vendor will contact you to arrange payment.",
        );

        navigate("/ordersuccess");
      } else {
        throw new Error("Order creation failed — please try again.");
      }
    } catch (err) {
      console.error("Order placement failed:", err.response ?? err.message);
      toast.error(
        err.response?.data?.message ||
          "Failed to place order. Your cart remains intact.",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;

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

          <Button
            onClick={() => setStep(2)}
            disabled={cartItems.length === 0}
            className="mt-6 w-full text-white"
          >
            Continue to Delivery
          </Button>
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
              className="w-1/2 py-3 rounded-lg"
            >
              Back to Cart
            </Button>
            <Button
              onClick={placeOrder}
              disabled={processing}
              className="w-1/2 text-white py-3 rounded-lg"
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
