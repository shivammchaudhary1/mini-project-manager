import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-light shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Mini Project Manager</Link>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-light hover:opacity-80 transition-opacity"
              >
                Dashboard
              </Link>
              <span className="text-light">
                Welcome, {user?.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-light hover:opacity-80 transition-opacity"
              >
                Login
              </Link>
              <Link to="/register" className="btn-secondary rounded-md">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
