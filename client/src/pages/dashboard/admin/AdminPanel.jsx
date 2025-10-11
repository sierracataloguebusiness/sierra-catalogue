import React from "react";
import { FaUsers, FaStore, FaBoxOpen, FaDollarSign } from "react-icons/fa";

const AdminPanel = () => {
  const stats = [
    {
      title: "Total Users",
      value: 1243,
      icon: <FaUsers />,
      color: "text-yellow-500",
    },
    {
      title: "Vendors",
      value: 87,
      icon: <FaStore />,
      color: "text-yellow-400",
    },
    {
      title: "Active Products",
      value: 534,
      icon: <FaBoxOpen />,
      color: "text-yellow-300",
    },
    {
      title: "Revenue",
      value: "$12,430",
      icon: <FaDollarSign />,
      color: "text-yellow-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-gold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-yellow-500/20 transition"
          >
            <div className={`p-3 bg-black rounded-full text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-yellow-400 font-semibold mb-4">
          Recent Activity
        </h2>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>
            ✅ New vendor registered:{" "}
            <span className="text-yellow-400">TechZone SL</span>
          </li>
          <li>📦 12 new products added today</li>
          <li>💬 3 customer feedback messages received</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
