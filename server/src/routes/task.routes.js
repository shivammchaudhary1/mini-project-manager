import express from "express";
const taskRoutes = express.Router();

import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

taskRoutes.post("/create", createTask);
// Get all tasks for a specific project with optional filtering
taskRoutes.get("/project/:projectId", getTasksByProject);
// Get a specific task by ID
taskRoutes.get("/get/:id", getTaskById);
// Update a task
taskRoutes.put("/update/:id", updateTask);
// Update only the status
taskRoutes.patch("/update-status/:id", updateTaskStatus);
taskRoutes.delete("/delete/:id", deleteTask);

export default taskRoutes;
