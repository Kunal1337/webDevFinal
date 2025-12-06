import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-20 py-10 mt-16">
      <div className="mb-6">
        <h4 className="font-bold mb-2">Watch Us Go</h4>
        <p className="text-gray-400">
          Premium watches delivered worldwide.
        </p>
      </div>

      <div className="mb-6">
        <h4 className="font-bold mb-2">Quick Links</h4>

        <ul className="list-none flex gap-5 p-0">
          <li>
            <Link
              to="/"
              className="text-gray-300 hover:text-primary transition"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/shop"
              className="text-gray-300 hover:text-primary transition"
            >
              Shop
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="text-gray-300 hover:text-primary transition"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-primary transition"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-5 text-sm text-center text-gray-500 pt-5 border-t border-gray-700">
        <p>
          &copy; {new Date().getFullYear()} Watch Us Go. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
