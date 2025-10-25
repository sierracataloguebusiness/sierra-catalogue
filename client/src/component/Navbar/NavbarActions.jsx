import { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { FaRegUser, FaUserCircle } from "react-icons/fa";
import { BiShoppingBag } from "react-icons/bi";
import { Link } from "react-router-dom";
import Button from "../Button.jsx";

const NavbarActions = ({
  mobileOpen,
  onMenuClick,
  onUserClick,
  isAuthenticated,
  logout,
  user,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = user
    ? {
        name: `${user.firstName || ""}`.trim() || user.name || "Guest user",
        role: user.role || "customer",
        image: user.image || "/default-profile.jpg",
      }
    : {
        name: "Guest user",
        role: "customer",
        image: "/default-profile.jpg",
      };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMenuItems = () => {
    switch (currentUser.role) {
      case "vendor":
        return [
          { name: "Dashboard", link: "/dashboard/vendor" },
          { name: "Shop", link: "/dashboard/vendor/shop" },
          { name: "Products", link: "/dashboard/vendor/products" },
          { name: "Orders", link: "/dashboard/vendor/orders" },
          { name: "Settings", link: "/dashboard/vendor/settings" },
        ];
      case "admin":
        return [
          { name: "Admin Panel", link: "/dashboard/admin" },
          { name: "Manage Users", link: "/dashboard/admin/users" },
          { name: "Manage Vendors", link: "/dashboard/admin/vendors" },
          {
            name: "Vendor Applications",
            link: "/dashboard/admin/vendor-application",
          },
          { name: "Settings", link: "/dashboard/admin/settings" },
        ];
      default:
        return [
          { name: "Dashboard", link: "/dashboard/customer" },
          { name: "Orders", link: "/dashboard/customer/orders" },
          { name: "Favorites", link: "/dashboard/customer/favorites" },
          { name: "Settings", link: "/dashboard/customer/settings" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="relative flex items-center gap-x-4">
      <Link to="/cart">
        <BiShoppingBag className="cursor-pointer max-md:size-8 md:size-7 text-gold-500" />
      </Link>

      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <FaUserCircle
            className="cursor-pointer size-7 text-gold-500"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-black/95 text-gold-400 rounded-2xl shadow-lg border border-gold-700 p-3 z-50 animate-fade-in">
              {/* Profile header */}
              <div className="flex items-center gap-3 border-b border-gold-700 pb-3 mb-2">
                <img
                  src={currentUser.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white truncate">
                    Hello {currentUser.name}
                  </p>
                  <Link
                    to={`/dashboard/${currentUser.role}/profile`}
                    className="text-xs text-gold-400 hover:underline"
                    onClick={() => setDropdownOpen(false)}
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Dynamic links */}
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className="block py-2 hover:text-white transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                  window.location.href = "/";
                }}
                className="w-full text-left mt-2 py-2 text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <FaRegUser
          className="cursor-pointer max-md:size-7 size-5 text-gold-500"
          onClick={onUserClick}
        />
      )}

      <Button
        to="/vendor-application"
        children="List now"
        className="max-md:hidden bg-gold-500 text-black font-semibold"
      />

      <IoMenu
        className={`cursor-pointer size-8 md:hidden text-gold-500 ${
          mobileOpen ? "opacity-0" : ""
        }`}
        onClick={onMenuClick}
      />
    </div>
  );
};

export default NavbarActions;
