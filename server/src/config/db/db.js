import mongoose from "mongoose";
import config from "../environment/default.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
