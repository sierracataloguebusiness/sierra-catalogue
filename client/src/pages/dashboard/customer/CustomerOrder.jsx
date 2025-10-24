import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../component/Loader.jsx";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  pending: "text-yellow-400",
  completed: "text-green-400",
  cancelled: "text-red-400",
  processing: "text-blue-400",
};

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
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to fetch your orders");
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
      toast.success("Order cancelled successfully");
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error("Failed to cancel order");
    }
  };

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-400">
        <p>You have no orders yet.</p>
      </div>
    );

  return (
    <div className="p-6 text-white min-h-screen bg-[#0d0d0d]">
      <h1 className="text-2xl text-primary-gold font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 border border-gray-700 rounded-xl p-5 bg-gray-800 shadow-md"
        >
          {/* Order Header */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
              <p>
                <strong className="text-primary-gold">Order ID:</strong> #
                {order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`font-semibold capitalize ${STATUS_COLORS[order.status] || "text-gray-300"}`}
            >
              {order.status}
            </span>
          </div>

          {/* Order Items */}
          <table className="w-full text-gray-300 text-sm mb-4">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-2 py-1">Item</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Price (NLe)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item._id} className="border-b border-gray-700">
                  <td className="px-2 py-1">{item.title}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">
                    {item.price?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total and Actions */}
          <div className="flex justify-between items-center">
            <p className="font-medium text-gray-300">
              <strong>Total:</strong> NLe {order.total?.toFixed(2) || "0.00"}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className="py-1.5 px-4 text-sm border border-primary-gold text-primary-gold rounded-lg hover:bg-primary-gold hover:text-black transition"
              >
                View Details
              </button>

              {order.status === "pending" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="py-1.5 px-4 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrder;
