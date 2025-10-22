import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const VendorDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        const res = await axios.get(
          "https://sierra-catalogue.onrender.com/api/vendor/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load vendor stats");
      }
    };

    if (token) fetchVendorStats();
  }, [token]);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBox />,
      color: "text-yellow-500",
    },
    {
      title: "Active Products",
      value: stats.activeProducts,
      icon: <FaCheckCircle />,
      color: "text-yellow-400",
    },
    {
      title: "Orders Received",
      value: stats.totalOrders,
      icon: <FaShoppingCart />,
      color: "text-yellow-300",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-gold mb-6">
        Welcome, {user?.firstName || "Vendor"}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-yellow-500/20 transition"
          >
            <div className={`p-3 bg-black rounded-full text-lg ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold text-white">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-2xl text-yellow-400 font-semibold mb-4">
          Quick Actions
        </h2>
        <ul className="text-gray-400 text-sm space-y-3">
          <li>
            <NavLink
              to="/vendor/products"
              className="hover:text-yellow-300 hover:underline"
            >
              View and manage your products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/orders"
              className="hover:text-yellow-300 hover:underline"
            >
              Track your recent orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vendor/shop"
              className="hover:text-yellow-300 hover:underline"
            >
              Update shop details or contact info
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VendorDashboard;
