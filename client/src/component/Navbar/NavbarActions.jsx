import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaRegUser, FaUserCircle } from "react-icons/fa";
import Button from "../Button.jsx";
import { Link } from "react-router-dom";
import { BiShoppingBag } from "react-icons/bi";
const NavbarActions = ({
  mobileOpen,
  onMenuClick,
  onUserClick,
  isAuthenticated,
  logout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-x-4">
      <Link to="/cart">
        <BiShoppingBag
          className="cursor-pointer max-md:size-8 md:size-7"
          aria-label="cart"
        />
      </Link>

      {isAuthenticated ? (
        <div className="relative">
          <FaUserCircle
            className="cursor-pointer size-7"
            aria-label="User Menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <FaRegUser
          className="cursor-pointer max-md:size-7 size-5"
          aria-label="User Account"
          onClick={onUserClick}
        />
      )}

      <Button
        to="/vendor-application"
        children="List now"
        className="max-md:hidden"
      />

      <IoMenu
        className={`cursor-pointer size-8 md:hidden ${mobileOpen ? "opacity-0" : ""}`}
        aria-label="Open Menu"
        onClick={onMenuClick}
      />
    </div>
  );
};

export default NavbarActions;
