import config from "../environment/default.js";
import connectDB from "../db/db.js";

export const initializeServer = async (app) => {
  const server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
  await connectDB();
  return server;
};
