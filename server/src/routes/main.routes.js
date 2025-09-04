import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import taskRoutes from "./task.routes.js";
import { protect } from "../middleware/auth.middleware.js";

function mainRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", protect, projectRoutes);
  app.use("/api/tasks", protect, taskRoutes);
}

export default mainRoutes;
