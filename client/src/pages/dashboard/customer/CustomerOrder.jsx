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
        const { data } = await axios.get("/api/order/", {
          withCredentials: true,
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
      await axios.put(`/api/orders/${orderId}/status`, { status: "cancelled" });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading orders...</p>;

  if (!orders.length)
    return (
      <div className="text-center mt-10 text-gray-500">
        <p>You have no orders yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <p className="text-gray-800 font-semibold">
                {order.items?.length} item(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                >
                  View Details
                </button>
                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
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
