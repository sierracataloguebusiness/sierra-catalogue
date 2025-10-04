import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

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

  const getToken = () => localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch cart again for checkout
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
      console.error(
        "Error fetching checkout cart:",
        err.response ?? err.message,
      );
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

  // Place Order
  const placeOrder = async () => {
    if (!delivery.firstName || !delivery.phone) {
      alert("Please enter your First Name and Phone Number");
      return;
    }

    setProcessing(true);
    try {
      const token = getToken();
      const res = await axios.post(
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

      alert("✅ Order placed successfully!");
      setCartItems([]); // clear cart on frontend
      navigate("/ordersuccess"); // redirect user to a confirmation page
    } catch (err) {
      console.error("Order failed:", err.response ?? err.message);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading checkout...</p>;

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      {/* Progress steps */}
      <div className="flex justify-center gap-6 mb-10">
        {["Review Order", "Delivery Details", "Payment Instructions"].map(
          (label, index) => (
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
          ),
        )}
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
                className="flex justify-between items-center border border-gray-700 p-4 mb-3"
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
            className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-lg"
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
              placeholder="Delivery Instructions (Optional)"
              value={delivery.instructions}
              onChange={(e) =>
                setDelivery({
                  ...delivery,
                  instructions: e.target.value,
                })
              }
              className="border border-gray-600 p-3 rounded bg-transparent"
            ></textarea>
          </div>

          <div className="flex justify-between font-semibold mt-6">
            <span>Total</span>
            <span>NLe {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="w-1/2 bg-gray-500 py-3 rounded-lg"
            >
              Back to Cart
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-1/2 bg-yellow-400 text-black py-3 rounded-lg"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Instructions */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Instructions</h2>
          <p className="mb-6">
            Please send your payment to one of the accounts below:
          </p>

          <ul className="list-disc ml-6 text-gray-300 mb-6">
            <li>Orange Money: 07XXXXXXX</li>
            <li>Afrimoney: 08XXXXXXX</li>
          </ul>

          <p className="text-gray-400 text-sm mb-4">
            Use your phone number as the payment reference.
          </p>

          <button
            onClick={placeOrder}
            disabled={processing}
            className="w-full bg-green-500 py-3 rounded-lg"
          >
            {processing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
