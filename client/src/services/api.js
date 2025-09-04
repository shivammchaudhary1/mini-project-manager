import config from "../../config/env.config";

// Helper function to handle API requests
const apiRequest = async (url, method = "GET", body = null) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Set headers
  const headers = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Set up request options
  const options = {
    method,
    headers,
  };

  // Add body if provided (for POST, PUT requests)
  if (body) {
    options.body = JSON.stringify(body);
  }

  // Make the request
  const response = await fetch(`${config.backend}${url}`, options);

  // Parse response
  const data = await response.json();

  // Check if request was successful
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// Auth service
export const authService = {
  login: (credentials) => apiRequest("/api/auth/login", "POST", credentials),
  register: (userData) => apiRequest("/api/auth/register", "POST", userData),
};

// Projects service
export const projectService = {
  getAll: () => apiRequest("/api/projects/get"),
  getById: (projectId) => apiRequest(`/api/projects/get/${projectId}`),
  create: (projectData) =>
    apiRequest("/api/projects/create", "POST", projectData),
  delete: (projectId) =>
    apiRequest(`/api/projects/delete/${projectId}`, "DELETE"),
};

// Tasks service
export const taskService = {
  getByProject: (projectId) => apiRequest(`/api/tasks/project/${projectId}`),
  create: (taskData) => apiRequest("/api/tasks/create", "POST", taskData),
  update: (taskId, taskData) =>
    apiRequest(`/api/tasks/update/${taskId}`, "PUT", taskData),
  updateStatus: (taskId, status) =>
    apiRequest(`/api/tasks/update-status/${taskId}`, "PATCH", { status }),
  delete: (taskId) => apiRequest(`/api/tasks/delete/${taskId}`, "DELETE"),
};

export default {
  auth: authService,
  projects: projectService,
  tasks: taskService,
};
