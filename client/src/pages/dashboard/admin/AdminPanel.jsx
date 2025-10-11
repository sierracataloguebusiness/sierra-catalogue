import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaStore, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    products: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://sierra-catalogue.onrender.com/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        toast.error("Failed to load admin stats");
      }
    };

    if (token) fetchStats();
  }, [token]);

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <FaUsers />,
      color: "text-yellow-500",
    },
    {
      title: "Vendors",
      value: stats.vendors,
      icon: <FaStore />,
      color: "text-yellow-400",
    },
    {
      title: "Active Products",
      value: stats.products,
      icon: <FaBoxOpen />,
      color: "text-yellow-300",
    },
    {
      title: "Revenue",
      value: `NLe ${stats.revenue.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        Sierra Catalogue Admin Dashboard
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
        <h2 className="text-xl text-yellow-400 font-semibold mb-4">
          Recent Activity
        </h2>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>✅ New vendor registered</li>
          <li>📦 Products added</li>
          <li>💬 Customer feedback received</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
