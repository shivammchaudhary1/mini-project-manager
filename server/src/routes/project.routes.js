import express from "express";
const projectRoutes = express.Router();
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

// Create a new project
projectRoutes.post("/create", createProject);

// Get all projects for the authenticated user
projectRoutes.get("/get", getProjects);

// Get, update, or delete a specific project by ID
projectRoutes.get("/get/:id", getProjectById);
projectRoutes.put("/update/:id", updateProject);
projectRoutes.delete("/delete/:id", deleteProject);

export default projectRoutes;
