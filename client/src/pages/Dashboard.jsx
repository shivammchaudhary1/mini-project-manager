import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProjects,
  createProject,
  deleteProject,
  sortProjects,
} from "../redux/slices/projectSlice";
import { logout } from "../redux/slices/authSlice";
import CreateProjectModal from "../modals/CreateProjectModal.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get Data
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Sort projects by date
  const handleSort = (order) => {
    setSortOrder(order);
    dispatch(sortProjects({ sortOrder: order }));
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
  const handleProjectSubmit = (projectData) => {
    dispatch(createProject(projectData)).then(() => {
      setIsModalOpen(false);
    });
  };

  // Handle project deletion
  const handleDeleteProject = (projectId) => {
    // Confirm before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    dispatch(deleteProject(projectId));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
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
