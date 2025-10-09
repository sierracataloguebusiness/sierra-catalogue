import { useState } from "react";
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
  user = { name: "Aaron Allieu", image: "/default-profile.jpg" },
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-x-4">
      <Link to="/cart">
        <BiShoppingBag className="cursor-pointer max-md:size-8 md:size-7 text-gold-500" />
      </Link>

      {isAuthenticated ? (
        <div className="relative">
          <FaUserCircle
            className="cursor-pointer size-7 text-gold-500"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-black/95 text-gold-400 rounded-2xl shadow-lg border border-gold-700 p-3 z-50 transition-all duration-200 animate-fade-in">
              <div className="flex items-center gap-3 border-b border-gold-700 pb-3 mb-2">
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <Link
                    to="/profile"
                    className="text-xs text-gold-400 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              <Link to="/dashboard" className="block py-2 hover:text-white">
                Dashboard
              </Link>
              <Link to="/orders" className="block py-2 hover:text-white">
                Orders
              </Link>
              <Link to="/favorites" className="block py-2 hover:text-white">
                Favorites
              </Link>
              <Link to="/settings" className="block py-2 hover:text-white">
                Settings
              </Link>
              <Link to="/help" className="block py-2 hover:text-white">
                Help
              </Link>

              <button
                onClick={logout}
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
