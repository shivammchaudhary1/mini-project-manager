import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Sample data for development - will be replaced with actual API call
const sampleData = {
  success: true,
  count: 3,
  projects: [
    {
      _id: "68b9429b6710bebab6df0e60",
      title: "My First Project",
      description: "Excited",
      user: "68b93ec0b5c8d3d2918ca421",
      createdAt: "2025-09-04T07:41:15.987Z",
      updatedAt: "2025-09-04T07:43:33.418Z",
    },
    {
      _id: "68b942bd6710bebab6df0e62",
      title: "Mini Project",
      description: "No Description",
      user: "68b93ec0b5c8d3d2918ca421",
      createdAt: "2025-09-04T07:41:49.511Z",
      updatedAt: "2025-09-04T07:41:49.511Z",
    },
    {
      _id: "68b942c36710bebab6df0e64",
      title: "Mini Project 333",
      description: "No Description",
      user: "68b93ec0b5c8d3d2918ca421",
      createdAt: "2025-09-04T07:41:55.421Z",
      updatedAt: "2025-09-04T07:41:55.421Z",
    },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    // Load projects (using sample data for now)
    // In a real app, you would fetch from your API
    setProjects([...sampleData.projects]);
  }, []);

  // Sort projects by date
  const handleSort = (order) => {
    setSortOrder(order);
    let sortedProjects = [...projects];

    if (order === "newest") {
      sortedProjects.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else {
      sortedProjects.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    }

    setProjects(sortedProjects);
  };

  // Handle creating a new project
  const handleCreateProject = () => {
    // In a real app, you would navigate to a form page or open a modal
    alert("Create new project functionality will go here");
  };

  // Handle logout
  const handleLogout = () => {
    // Clear any stored tokens/user data
    localStorage.removeItem("token");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header section with logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>

      {/* Welcome and action section */}
      <div className="bg-light p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Welcome to your Dashboard!
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <button onClick={handleCreateProject} className="btn-primary">
            Create New Project
          </button>

          <div className="flex items-center">
            <span className="mr-2">Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
              className="border rounded p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects list section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Your Projects</h2>

        {projects.length === 0 ? (
          <div className="bg-light p-6 rounded-lg shadow-md text-center">
            <p>No projects found. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-light p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {project.title}
                </h3>
                <p className="mb-3">{project.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
