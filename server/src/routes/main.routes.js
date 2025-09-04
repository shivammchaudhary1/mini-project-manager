import authRoutes from "./auth.routes.js";

function mainRoutes(app) {
  app.use("/api/auth", authRoutes);
}

export default mainRoutes;
