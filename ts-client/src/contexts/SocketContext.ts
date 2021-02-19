import { createContext } from 'react';
import ioClient from "socket.io-client";

export const socket = ioClient("https://cah-project-server.herokuapp.com/", {})
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
