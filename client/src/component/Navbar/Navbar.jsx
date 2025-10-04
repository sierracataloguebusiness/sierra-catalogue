import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import NavbarLinks from "./NavbarLinks.jsx";
import NavbarActions from "./NavbarActions.jsx";
import { Link } from "react-router-dom";
import MobileNav from "./MobileNav.jsx";
import AccountForm from "../Form/AccountForm.jsx";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="sticky top-0 bg-black border-b border-gray-700 h-20 px-5 py-5 text-white z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={"/assets/logo.png"} alt={"logo"} width={150} />
          </Link>
          <NavbarLinks hidden={true} />
          <NavbarActions
            mobileOpen={mobileOpen}
            onMenuClick={() => setMobileOpen(!mobileOpen)}
            onUserClick={() => {
              setIsFormOpen(!isFormOpen);
              setIsLoginForm(true);
            }}
            isAuthenticated={isAuthenticated}
            logout={() => {
              localStorage.removeItem("token");
              logout();
            }}
          />
        </div>
        <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </nav>

      {isFormOpen && (
        <AccountForm
          onClose={() => {
            setIsFormOpen(false);
            setIsLoginForm(true);
          }}
          isLoginForm={isLoginForm}
          setIsLoginForm={setIsLoginForm}
        />
      )}
    </>
  );
};

export default Navbar;
