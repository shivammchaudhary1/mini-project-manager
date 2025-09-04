import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const Navbar = () => {
  return (
    <nav className="bg-primary text-light shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Mini Project Manager</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-light hover:opacity-80 transition-opacity"
          >
            Login
          </Link>
          <Link to="/register" className="btn-secondary rounded-md">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
