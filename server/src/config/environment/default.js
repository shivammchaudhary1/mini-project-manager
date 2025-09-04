import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 8080,
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/mini-project-manager",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
};
