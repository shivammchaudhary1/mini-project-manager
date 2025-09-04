import express from "express";
import cors from "cors";
import config from "../environment/default.js";
import mainRoutes from "../../routes/main.routes.js";

export const configureExpress = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  mainRoutes(app);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running" });
  });

  return app;
};
