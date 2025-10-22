import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";
import Button from "../../../component/Button.jsx";

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
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (orderId, itemId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? {
              ...order,
              items: order.items.map((i) =>
                i._id === itemId ? { ...i, status } : i,
              ),
            }
          : order,
      ),
    );
  };

  const handleBulkChange = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, items: order.items.map((i) => ({ ...i, status })) }
          : order,
      ),
    );
  };

  const saveOrder = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    try {
      setUpdating(true);
      await axios.put(
        `${API_BASE}/orders/${orderId}/items`,
        {
          items: order.items.map((i) => ({ _id: i._id, status: i.status })),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order updated!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;
  if (orders.length === 0)
    return <p className="text-gray-400">No vendor orders yet.</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Vendor Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 border border-gray-700 rounded-xl p-4 bg-gray-800"
        >
          <div className="flex justify-between mb-4">
            <span>
              <strong>Order ID:</strong> {order._id}
            </span>
            <span>
              <strong>Status:</strong>{" "}
              <span className={STATUS_COLORS[order.status]}>
                {order.status}
              </span>
            </span>
          </div>

          <div className="flex justify-end gap-2 mb-2">
            <Button
              onClick={() => handleBulkChange(order._id, "accepted")}
              className="py-1 px-3 text-green-400 border border-green-400 rounded"
            >
              Accept All
            </Button>
            <Button
              onClick={() => handleBulkChange(order._id, "rejected")}
              className="py-1 px-3 text-red-400 border border-red-400 rounded"
            >
              Reject All
            </Button>
          </div>

          <table className="min-w-full text-gray-300 mb-4">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-2 py-1">Item</th>
                <th className="px-2 py-1">Qty</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id} className="border-b border-gray-700">
                  <td className="px-2 py-1">{item.title}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">{item.price.toFixed(2)}</td>
                  <td
                    className={`px-2 py-1 font-semibold ${STATUS_COLORS[item.status || "pending"]}`}
                  >
                    <select
                      value={item.status || "pending"}
                      onChange={(e) =>
                        handleItemChange(order._id, item._id, e.target.value)
                      }
                      className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
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

          <div className="flex justify-end">
            <Button
              onClick={() => saveOrder(order._id)}
              disabled={updating}
              className="py-2 px-4"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorOrders;
