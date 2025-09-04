import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config/env.config.js";
import CreateTaskModal from "../modals/CreateTaskModal.jsx";
import UpdateTaskModal from "../modals/UpdateTaskModal.jsx";

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch project details and tasks
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(
          `${config.backend}/api/projects/get/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const projectData = await projectResponse.json();

        if (!projectResponse.ok) {
          throw new Error(projectData.message || "Failed to fetch project");
        }

        if (projectData.success) {
          setProject(projectData.project);
        }

        // Fetch tasks for this project
        const tasksResponse = await fetch(
          `${config.backend}/api/tasks/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const tasksData = await tasksResponse.json();

        if (!tasksResponse.ok) {
          throw new Error(tasksData.message || "Failed to fetch tasks");
        }

        if (tasksData.success) {
          setTasks(tasksData.tasks);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId, navigate]);

  // Create a new task
  const handleCreateTask = () => {
    setIsCreateModalOpen(true);
  };

  // Close create modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Open update modal
  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  // Close update modal
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTask(null);
  };

  // Submit new task
  const handleTaskSubmit = async (taskData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${config.backend}/api/tasks/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new task to state
        setTasks([data.task, ...tasks]);
        setIsCreateModalOpen(false);
      } else {
        console.error("Failed to create task:", data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Submit task update
  const handleTaskUpdate = async (taskData) => {
    try {
      if (!selectedTask) return;

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${config.backend}/api/tasks/update/${selectedTask._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...taskData,
            projectId: projectId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the task in state
        const updatedTasks = tasks.map((task) =>
          task._id === selectedTask._id ? data.task : task
        );
        setTasks(updatedTasks);
        setIsUpdateModalOpen(false);
        setSelectedTask(null);
      } else {
        console.error("Failed to update task:", data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Toggle task status
  const handleToggleStatus = async (task) => {
    try {
      const token = localStorage.getItem("token");

      // Determine next status
      let newStatus;
      switch (task.status) {
        case "todo":
          newStatus = "in-progress";
          break;
        case "in-progress":
          newStatus = "done";
          break;
        case "done":
          newStatus = "todo";
          break;
        default:
          newStatus = "todo";
      }

      // Update task status via API
      const response = await fetch(
        `${config.backend}/api/tasks/update-status/${task._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the task in state
        const updatedTasks = tasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);
      } else {
        console.error("Failed to update task status:", data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${config.backend}/api/tasks/delete/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove task from state
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        console.error("Failed to delete task:", data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Return to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 p-4 rounded-md mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button onClick={handleBackToDashboard} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get status display text
  const getStatusText = (status) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  // Sort tasks by due date
  const handleSortByDueDate = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  // Filter tasks by status
  const handleFilterByStatus = (e) => {
    setStatusFilter(e.target.value);
  };

  // Get filtered and sorted tasks
  const getFilteredAndSortedTasks = () => {
    let filteredTasks = [...tasks];

    // Apply status filter
    if (statusFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    // Sort by due date
    filteredTasks.sort((a, b) => {
      // Handle tasks without due dates
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filteredTasks;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleTaskSubmit}
        projectId={projectId}
      />

      <UpdateTaskModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSubmit={handleTaskUpdate}
        task={selectedTask}
      />

      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center mr-4 text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-left mr-1"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-primary flex-grow">
          {project?.title || "Project Tasks"}
        </h1>
      </div>

      {/* Project info and actions */}
      <div className="bg-light p-6 rounded-lg shadow-md mb-8">
        <p className="text-gray-700 mb-4">{project?.description}</p>
        <button onClick={handleCreateTask} className="btn-primary">
          Create New Task
        </button>
      </div>

      {/* Tasks list */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Tasks</h2>

        {/* Sorting and Filtering Controls */}
        {tasks.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center">
              <button
                onClick={handleSortByDueDate}
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Sort by Due Date
                {sortOrder === "asc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up ml-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down ml-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-gray-700">
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={handleFilterByStatus}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="bg-light p-6 rounded-lg shadow-md text-center">
            <p>No tasks found for this project. Create your first task!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {getFilteredAndSortedTasks().map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-700 mt-2">{task.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {getStatusText(task.status)}
                      </button>
                      {task.dueDate && (
                        <span className="text-sm text-gray-600">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTask(task)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      aria-label="Edit task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete task"
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
