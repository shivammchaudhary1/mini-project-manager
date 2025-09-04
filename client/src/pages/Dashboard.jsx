import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../modals/CreateProjectModal.jsx";
import config from "../../config/env.config.js";

// Sample data for development - will be replaced with actual API call

// const sampleData = {
//   success: true,
//   count: 3,
//   projects: [
//     {
//       _id: "68b9429b6710bebab6df0e60",
//       title: "My First Project",
//       description: "Excited",
//       user: "68b93ec0b5c8d3d2918ca421",
//       createdAt: "2025-09-04T07:41:15.987Z",
//       updatedAt: "2025-09-04T07:43:33.418Z",
//     },
//     {
//       _id: "68b942bd6710bebab6df0e62",
//       title: "Mini Project",
//       description: "No Description",
//       user: "68b93ec0b5c8d3d2918ca421",
//       createdAt: "2025-09-04T07:41:49.511Z",
//       updatedAt: "2025-09-04T07:41:49.511Z",
//     },
//     {
//       _id: "68b942c36710bebab6df0e64",
//       title: "Mini Project 333",
//       description: "No Description",
//       user: "68b93ec0b5c8d3d2918ca421",
//       createdAt: "2025-09-04T07:41:55.421Z",
//       updatedAt: "2025-09-04T07:41:55.421Z",
//     },
//   ],
// };

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Get Data
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Make authenticated GET request with Bearer token
        const response = await fetch(`${config.backend}/api/projects/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Fetched projects:", data);
        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
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
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle project submission
  const handleProjectSubmit = async (projectData) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Send project data to API with authentication
      const response = await fetch(`${config.backend}/api/projects/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();
      console.log("Project submission response:", data);

      if (data.success) {
        // Add the new project to the state
        setProjects([data.project, ...projects]);
        setIsModalOpen(false);
      } else {
        console.error("Failed to create project:", data.message);
        // You could add error handling UI here
      }
    } catch (error) {
      console.error("Error creating project:", error);
      // You could add error handling UI here
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      // Confirm before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this project?"
      );
      if (!confirmDelete) return;

      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Delete project through API
      const response = await fetch(
        `${config.backend}/api/projects/delete/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Project deletion response:", data);

      if (data.success) {
        // Remove project from state
        setProjects(projects.filter((project) => project._id !== projectId));
      } else {
        console.error("Failed to delete project:", data.message);
        // You could add error handling UI here
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      // You could add error handling UI here
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear any stored tokens/user data
    localStorage.removeItem("token");
    // Navigate to login page
    navigate("/login");
  };

  // redirect to tasks
  const handleProjectClick = (project) => {
    navigate(`/tasks/${project._id}`);
    console.log("Clicked project:", project);
  };
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleProjectSubmit}
      />

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
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-xl font-bold text-primary cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    {project.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-3"
                    aria-label="Delete project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                </div>
                <p
                  className="mb-3 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  {project.description}
                </p>
                <div
                  className="flex justify-between items-center text-sm text-gray-600 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
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
