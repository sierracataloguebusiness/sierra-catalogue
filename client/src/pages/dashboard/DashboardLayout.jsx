import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FaShoppingBag,
  FaCog,
  FaHeart,
  FaChartLine,
  FaBars,
  FaSignOutAlt,
  FaUsers,
  FaStore,
  FaClipboardList,
  FaUser,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || "customer";
  const basePath = `/dashboard/${role}`;

  const menuItems = {
    customer: [
      { name: "Dashboard", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Profile", icon: <FaUser />, link: `${basePath}/profile` },
      { name: "Orders", icon: <FaShoppingBag />, link: `${basePath}/orders` },
      { name: "Favorites", icon: <FaHeart />, link: `${basePath}/favorites` },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
    vendor: [
      { name: "Dashboard", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Profile", icon: <FaUser />, link: `${basePath}/profile` },
      { name: "My Shop", icon: <FaStore />, link: `${basePath}/shop` },
      { name: "Products", icon: <FaBoxOpen />, link: `${basePath}/products` },
      { name: "Orders", icon: <FaShoppingCart />, link: `${basePath}/orders` },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
    admin: [
      { name: "Admin Panel", icon: <FaChartLine />, link: `${basePath}` },
      { name: "Profile", icon: <FaUser />, link: `${basePath}/profile` },
      { name: "Users", icon: <FaUsers />, link: `${basePath}/users` },
      { name: "Vendors", icon: <FaStore />, link: `${basePath}/vendors` },
      {
        name: "Vendor Applications",
        icon: <FaClipboardList />,
        link: `${basePath}/vendor-application`,
      },
      { name: "Settings", icon: <FaCog />, link: `${basePath}/settings` },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-gold-400">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-black/90 border-r border-gold-700 flex flex-col transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} px-4 py-4 border-b border-gold-700`}
        >
          <h1
            className={`text-lg font-bold text-gold-500 transition-all ${
              sidebarOpen ? "opacity-100" : "hidden w-0"
            }`}
          >
            {role === "admin"
              ? "Admin Dashboard"
              : role === "vendor"
                ? "Vendor Panel"
                : "Customer Dashboard"}
          </h1>
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-gold-500 hover:text-gold-300"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {currentMenu.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg mx-2 my-1 transition-colors ${
                location.pathname.startsWith(item.link)
                  ? "bg-primary-gold text-black font-semibold"
                  : "hover:bg-primary-gold/20 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-5 py-4 border-t border-gold-700">
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
