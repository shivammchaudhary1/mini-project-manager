import { configureExpress } from "./src/config/setup/express.js";
import { initializeServer } from "./src/config/setup/setup.js";

const app = configureExpress();
const server = await initializeServer(app);

export default server;
