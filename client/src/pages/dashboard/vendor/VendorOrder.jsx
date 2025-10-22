import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../component/Loader.jsx";

const API_BASE = "https://sierra-catalogue.onrender.com/api";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vendor/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/vendor/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Order marked as ${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (loading) return <Loader />;

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-amber-400">Vendor Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-400">No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                Order #{order._id.slice(-6)}
              </h2>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  order.status === "pending"
                    ? "bg-yellow-500 text-black"
                    : order.status === "shipped"
                      ? "bg-blue-500 text-white"
                      : "bg-green-600 text-white"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="text-sm text-gray-300 mb-3">
              <p>
                <strong>Buyer:</strong> {order.delivery.firstName}{" "}
                {order.delivery.lastName}
              </p>
              <p>
                <strong>Phone:</strong> {order.delivery.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.delivery.address || "N/A"}
              </p>
            </div>

            <div className="border-t border-gray-700 mt-3 pt-3">
              {order.items.map((item) => (
                <div
                  key={item.listingId}
                  className="flex justify-between items-center text-sm py-2"
                >
                  <span>{item.title}</span>
                  <span>
                    {item.quantity} × NLe {item.price} ={" "}
                    <strong>NLe {item.price * item.quantity}</strong>
                  </span>
                </div>
              ))}
              <div className="flex justify-between mt-3 font-semibold">
                <span>Subtotal</span>
                <span>NLe {order.subtotal.toFixed(2)}</span>
              </div>
            </div>

            {order.status !== "completed" && (
              <div className="mt-4 flex gap-3">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateStatus(order._id, "shipped")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Mark as Shipped
                  </button>
                )}
                {order.status === "shipped" && (
                  <button
                    onClick={() => updateStatus(order._id, "completed")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;
