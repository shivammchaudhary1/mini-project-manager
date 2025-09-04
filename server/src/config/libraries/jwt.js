import jwt from "jsonwebtoken";
import config from "../environment/default.js";

export const generateToken = (payload, options = {}) => {
  try {
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    throw new Error("Token creation failed");
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Error verifying token");
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
