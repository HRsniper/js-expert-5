import fs from "fs";
import https from "https";
import { Server } from "socket.io";
import { logger } from "./logger.js";
import { Routes } from "./routes.js";

const PORT = process.env.PORT || 3000;

const localHostSSL = {
  key: fs.readFileSync("./certificates/key.pem"),
  cert: fs.readFileSync("./certificates/cert.pem")
};

const routes = new Routes();

/*
 * routes.handler.bind(routes)
 * fix the context of the 'handler' to know what 'handler' has in 'this'
 */
const server = https.createServer(localHostSSL, routes.handler.bind(routes));

// insecure io
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false
  }
});

routes.setSocketInstance(io);

io.on("connection", (socket) => logger.info(`New client connected: ${socket.id}`));

const startServer = () => {
  const { address, port } = server.address();

  logger.info(`Server started at https://${address}:${port}`);
};

server.listen(PORT, startServer);