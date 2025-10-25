import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";

const STATUS_COLORS = {
  pending: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
  accepted: "bg-green-900/40 text-green-400 border border-green-700",
  rejected: "bg-red-900/40 text-red-400 border border-red-700",
  cancelled: "bg-red-900/40 text-red-400 border border-red-700",
  partially_accepted:
    "bg-orange-900/40 text-orange-400 border border-orange-700",
  completed: "bg-green-900/40 text-green-500 border border-green-700",
  out_of_stock: "bg-blue-900/40 text-blue-500 border border-blue-700",
};

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/order/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
      console.log(res.data.orders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.put(
        `/api/order/${orderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  const toggleExpand = (orderId) =>
    setExpanded(expanded === orderId ? null : orderId);

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-400">
        You have no orders yet.
      </div>
    );

  return (
    <div className="p-6 text-white min-h-screen bg-[#0d0d0d]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-gold">
        My Orders
      </h1>

      {orders.map((order) => {
        const isOpen = expanded === order._id;
        const orderStatusClass =
          STATUS_COLORS[order.status] ||
          "bg-gray-700 text-gray-300 border border-gray-600";

        return (
          <div
            key={order._id}
            className="mb-4 border border-gray-700 rounded-xl bg-gray-800 shadow-md overflow-hidden transition-all"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer select-none hover:bg-gray-700 transition"
              onClick={() => toggleExpand(order._id)}
            >
              <div>
                <p>
                  <strong>Order ID:</strong> #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-semibold rounded-full ${orderStatusClass}`}
              >
                {order.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* Collapsible Body */}
            <div
              className={`transition-all duration-300 ${
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="p-4 border-t border-gray-700 space-y-4">
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
                      {order.items?.map((item) => {
                        const itemStatusClass =
                          STATUS_COLORS[item.status] ||
                          "bg-gray-700 text-gray-300 border border-gray-600";
                        return (
                          <tr
                            key={item._id}
                            className="border-b border-gray-700"
                          >
                            <td className="px-2 py-1">{item.title}</td>
                            <td className="px-2 py-1">{item.quantity}</td>
                            <td className="px-2 py-1">
                              {item.price?.toFixed(2) || "0.00"}
                            </td>
                            <td className="px-2 py-1">
                              <span
                                className={`px-2 py-1 my-1 text-xs font-semibold rounded-full ${itemStatusClass}`}
                              >
                                {(item.status || "pending")
                                  .replaceAll("_", " ")
                                  .toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-3">
                  <p className="text-gray-300">
                    <strong>Total:</strong> NLe{" "}
                    {order.total?.toFixed(2) || "0.00"}
                  </p>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {order.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelOrder(order._id);
                        }}
                        className="py-1.5 px-4 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerOrder;
