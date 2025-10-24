import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api/vendor";

const STATUS_COLORS = {
  pending: "text-yellow-400",
  accepted: "text-green-400",
  rejected: "text-red-400",
  out_of_stock: "text-gray-400",
  partially_accepted: "text-orange-400",
};

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.log(orders);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to fetch vendor orders",
      );
    } finally {
      setLoading(false);
    }
  };

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
      toast.success("Item status updated successfully");
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

      console.log(order);
      console.log(itemsPayload);

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

  if (orders.length === 0)
    return (
      <div className="p-6 text-center text-gray-400">
        <p>No vendor orders yet.</p>
      </div>
    );

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl text-primary-gold font-bold mb-6">
        Vendor Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 border border-gray-700 rounded-xl p-5 bg-gray-800 shadow-md"
        >
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Buyer:</strong> {order.delivery?.firstName}{" "}
                {order.delivery?.lastName}
              </p>
              <p>
                <strong>Address:</strong> {order.delivery?.address}
              </p>
            </div>
            <span
              className={`font-semibold ${STATUS_COLORS[order.vendorStatus] || "text-gray-300"}`}
            >
              {order.vendorStatus.toUpperCase()}
            </span>
          </div>

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
          <table className="w-full text-gray-300 text-sm">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-2 py-1">Item</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Price(Nle)</th>
                <th className="px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id} className="border-b border-gray-700">
                  <td className="px-2 py-1">{item.title}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">{item.price?.toFixed(2)}</td>
                  <td className="px-2 py-1">
                    <select
                      value={item.status || "pending"}
                      onChange={(e) =>
                        updateItemStatus(order._id, item._id, e.target.value)
                      }
                      className={`bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none ${STATUS_COLORS[item.status || "pending"]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          {/*<div className="flex justify-end mt-3 text-gray-300">*/}
          {/*  <p>*/}
          {/*    <strong>Total:</strong> Nle{order.total?.toFixed(2) || "0.00"}*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
      ))}
    </div>
  );
};

export default VendorOrders;
