import React from "react";
import "../index.css";

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Project Manager. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-sm text-light hover:opacity-80 transition-opacity"
              style={{ color: "var(--peach)" }}
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-light hover:opacity-80 transition-opacity"
              style={{ color: "var(--peach)" }}
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-light hover:opacity-80 transition-opacity"
              style={{ color: "var(--peach)" }}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
