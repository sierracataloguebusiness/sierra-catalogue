import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/order/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/order/${orderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-300">Loading orders...</p>;

  if (!orders.length)
    return (
      <div className="text-center mt-10 text-gray-400">
        <p>You have no orders yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#0d0d0d] min-h-screen text-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-[#d4af37]">My Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-700 rounded-xl p-5 shadow-md bg-[#1a1a1a] hover:border-[#d4af37] transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-[#d4af37]">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${
                  order.status === "completed"
                    ? "bg-green-900/40 text-green-400 border border-green-700"
                    : order.status === "cancelled"
                      ? "bg-red-900/40 text-red-400 border border-red-700"
                      : "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-3">
              <p className="text-gray-300 font-medium">
                {order.items?.length} item(s)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="px-4 py-1.5 text-sm border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-black transition"
                >
                  View Details
                </button>
                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrder;
