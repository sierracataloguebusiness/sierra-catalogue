import React from "react";
import { NavLink } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize.jsx";

const NavbarLinks = ({ hidden, onClick }) => {
  const { width } = useWindowSize();

  return (
    <div
      className={`${width < 768 ? "flex-col" : ""} ${hidden ? "max-md:hidden" : ""} navlinks flex items-center gap-8`}
    >
      <NavLink to="/" className="link" onClick={onClick}>
        Home
      </NavLink>
      <NavLink to="/shop" className="link" onClick={onClick}>
        Shop
      </NavLink>
      <NavLink to="/blog" className="link" onClick={onClick}>
        Blog
      </NavLink>
      <NavLink to="/deals" className="link" onClick={onClick}>
        Deals
      </NavLink>
      <NavLink to="/contact" className="link" onClick={onClick}>
        Contact
      </NavLink>
    </div>
  );
};
export default NavbarLinks;
