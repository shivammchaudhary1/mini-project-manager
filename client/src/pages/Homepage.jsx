import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Manage Your Projects{" "}
                <span className="text-blue-600">Efficiently</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-md">
                Streamline your workflow, collaborate with team members, and
                keep track of all your project tasks in one place.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow-xl">
                <div className="aspect-w-16 aspect-h-9 bg-blue-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-24 w-24 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="mt-4 font-semibold">
                      Project Dashboard Visualization
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
