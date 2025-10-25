import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../component/Loader.jsx";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  pending: "bg-yellow-400 text-black",
  accepted: "bg-green-400 text-black",
  rejected: "bg-red-400 text-white",
  out_of_stock: "bg-gray-400 text-black",
  partially_accepted: "bg-orange-400 text-black",
  partially_completed: "bg-orange-400 text-black",
  completed: "bg-green-400 text-black",
  cancelled: "bg-red-400 text-white",
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
    <div className="p-4 sm:p-6 text-white min-h-screen bg-[#0d0d0d]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-gold">
        My Orders
      </h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-700 rounded-xl p-4 sm:p-5 bg-gray-800 shadow-md flex flex-col gap-4"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                  STATUS_COLORS[order.status] || "bg-gray-300 text-black"
                }`}
              >
                {order.status.replaceAll("_", " ").toUpperCase() || "pending"}
              </span>
            </div>

            {/* Order Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-gray-300 text-sm min-w-[400px]">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="px-2 py-1">Item</th>
                    <th className="px-2 py-1">Qty</th>
                    <th className="px-2 py-1">Price (NLe)</th>
                    <th className="px-2 py-1">Status</th>
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
                      <td className="px-2 py-1">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            STATUS_COLORS[item.status] ||
                            "bg-gray-300 text-black"
                          }`}
                        >
                          {item.status.replaceAll("_", " ").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <p className="font-medium text-gray-300">
                <strong>Total:</strong> NLe {order.total?.toFixed(2) || "0.00"}
              </p>

              <div className="flex gap-2 sm:gap-3 flex-wrap">
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
    </div>
  );
};

export default CustomerOrder;
