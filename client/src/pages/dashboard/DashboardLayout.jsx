import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaUser,
  FaShoppingBag,
  FaCog,
  FaHeart,
  FaChartLine,
} from "react-icons/fa";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role || "customer";

  const basePath = `/dashboard/${role}`;

  const menuItems = {
    customer: [
      { name: "Dashboard", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Orders", icon: <FaShoppingBag />, link: `${basePath}/orders` },
      { name: "Favorites", icon: <FaHeart />, link: `${basePath}/favorites` },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
    vendor: [
      { name: "Dashboard", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Shop", icon: <FaShoppingBag />, link: `${basePath}/shop` },
      { name: "Orders", icon: <FaShoppingBag />, link: `${basePath}/orders` },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
    admin: [
      { name: "Admin Panel", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Users", icon: <FaUser />, link: `${basePath}/users` },
      { name: "Vendors", icon: <FaUser />, link: `${basePath}/vendors` },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-gold-400">
      <aside className="fixed top-0 left-0 right-0 bg-black/90 border-b border-gold-700 flex items-center justify-between px-6 py-3 shadow-md z-50">
        <div className="flex items-center gap-8 overflow-x-auto">
          {currentMenu.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gold-500 hover:text-black transition ${
                location.pathname === item.link
                  ? "bg-gold-500 text-black font-semibold"
                  : ""
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 pt-16 p-6 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
