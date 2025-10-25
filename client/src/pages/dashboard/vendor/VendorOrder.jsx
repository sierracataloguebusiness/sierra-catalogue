import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api/vendor";

const STATUS_COLORS = {
  pending: "bg-yellow-900/40 text-yellow-400 border border-yellow-700",
  accepted: "bg-green-900/40 text-green-400 border border-green-700",
  rejected: "bg-red-900/40 text-red-400 border border-red-700",
  out_of_stock: "bg-blue-900/40 text-blue-500 border border-blue-700",
  partially_accepted:
    "bg-orange-900/40 text-orange-400 border border-orange-700",
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to fetch vendor orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId) =>
    setExpanded(expanded === orderId ? null : orderId);

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                items: o.items.map((i) =>
                  i._id === itemId ? { ...i, status } : i,
                ),
              }
            : o,
        ),
      );
      await axios.put(
        `${API_BASE}/orders/${orderId}/item/${itemId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Item status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update item status",
      );
      fetchOrders();
    }
  };

  const updateAllItems = async (orderId, status) => {
    try {
      setUpdating(true);
      const order = orders.find((o) => o._id === orderId);
      const itemsPayload = order.items.map((i) => ({ _id: i._id, status }));

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, items: o.items.map((i) => ({ ...i, status })) }
            : o,
        ),
      );

      await axios.put(
        `${API_BASE}/orders/${orderId}/items`,
        { items: itemsPayload },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("All item statuses updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update all items");
      fetchOrders();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;
  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-400">No vendor orders yet.</div>
    );

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-gold">
        Vendor Orders
      </h1>

      {orders.map((order) => {
        const isOpen = expanded === order._id;
        const orderStatusClass =
          STATUS_COLORS[order.vendorStatus] ||
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
                  <strong>Order ID:</strong> #{order.order?.slice(-6) || "N/A"}
                </p>
                <p>
                  <strong>Buyer:</strong> {order.delivery?.firstName}{" "}
                  {order.delivery?.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  {order.delivery?.address}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-semibold rounded-full ${orderStatusClass}`}
              >
                {order.vendorStatus.toUpperCase()}
              </span>
            </div>

            {/* Collapsible Body */}
            <div
              className={`transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
            >
              <div className="p-4 border-t border-gray-700 space-y-4">
                <div className="flex justify-end gap-2 mb-3">
                  <button
                    onClick={() => updateAllItems(order._id, "accepted")}
                    className="py-1 px-3 text-green-400 border border-green-400 rounded hover:bg-green-400 hover:text-black transition"
                    disabled={updating}
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => updateAllItems(order._id, "rejected")}
                    className="py-1 px-3 text-red-400 border border-red-400 rounded hover:bg-red-400 hover:text-black transition"
                    disabled={updating}
                  >
                    Reject All
                  </button>
                </div>

                {/* Order Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300 text-sm min-w-[400px]">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="px-2 py-1">Item</th>
                        <th className="px-2 py-1">Qty</th>
                        <th className="px-2 py-1">Price(NLe)</th>
                        <th className="px-2 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => {
                        const itemStatusClass =
                          STATUS_COLORS[item.status || "pending"];
                        return (
                          <tr
                            key={item._id}
                            className="border-b border-gray-700"
                          >
                            <td className="px-2 py-1">{item.title}</td>
                            <td className="px-2 py-1">{item.quantity}</td>
                            <td className="px-2 py-1">
                              {item.price?.toFixed(2)}
                            </td>
                            <td className="px-2 py-1">
                              <select
                                value={item.status || "pending"}
                                onChange={(e) =>
                                  updateItemStatus(
                                    order._id,
                                    item._id,
                                    e.target.value,
                                  )
                                }
                                className={`bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none ${itemStatusClass}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="out_of_stock">
                                  Out of Stock
                                </option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VendorOrders;
