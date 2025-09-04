import express from "express";
const authRoutes = express.Router();

import { register, login } from "../controllers/auth.controller.js";

authRoutes.post("/register", register);
authRoutes.post("/login", login);

export default authRoutes;
