import ioClient from "socket.io-client";

export const socket = ioClient("http://localhost:5000", {
  withCredentials: true,
});
