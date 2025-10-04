import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="min-h-[40vh] border-t border-gray-700 pt-3">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
        <div>
          <img src="/assets/logo.png" alt="logo" />
          <p className="m-auto w-3/4">
            Sierra Catalogue you one stop shop for all your shopping and service
            needs
          </p>
        </div>
        <div className="mx-auto w-3/4">
          <h3 className="mt-2 font-bold text-primary-gold text-2xl">
            Quick Links
          </h3>
          <ul className="list-none flex flex-col gap-4 mt-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="mx-auto w-3/4">
          <h3 className="mt-2 font-bold text-primary-gold text-2xl">
            Legal Links
          </h3>
          <ul className="list-none flex flex-col gap-4 mt-4">
            <li>
              <Link to="/vendor-guidelines">Vendor Guidelines</Link>
            </li>
            <li>
              <Link to="vendor-application">Vendor Application</Link>
            </li>
            <li>
              <Link to="terms-of-service">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm py-2 border-t border-gray-700">
        &copy; {new Date().getFullYear()} Sierra Catalogue. All rights reserved.
      </p>
    </div>
  );
};
export default Footer;
