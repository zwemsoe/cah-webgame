import { config } from "./constants";

const url = config.url.CLIENT_URL;

export default (server: any) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: url,
      credentials: true,
      pingTimeout: 30000,
    },
  });

  io.on("connection", (socket: any) => {
    require("./handlers/user-handler")(socket, io);
    require("./handlers/game-handler")(socket, io);
  });

  return io;
};
