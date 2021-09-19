import fs from "fs";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import { logger } from "./logger.js";
import { Routes } from "./routes.js";

const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";
process.env.USER = process.env.USER ?? "system_user";

const localHostSSL = {
  key: fs.readFileSync("./certificates/key.pem"),
  cert: fs.readFileSync("./certificates/cert.pem")
};

const protocol = isProduction ? http : https;
const sslConfig = isProduction ? {} : localHostSSL;

const routes = new Routes();
/*
 * routes.handler.bind(routes)
 * fix the context of the 'handler' to know what 'handler' has in 'this'
 */
const server = protocol.createServer(sslConfig, routes.handler.bind(routes));

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
  const protocol = isProduction ? "http" : "https";
  logger.info(`Server started at ${protocol}://${address}:${port}`);
};

server.listen(PORT, startServer);
