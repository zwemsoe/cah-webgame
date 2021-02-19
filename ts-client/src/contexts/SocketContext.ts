import { createContext } from 'react';
import ioClient from "socket.io-client";

export const socket = ioClient("https://cah-project.herokuapp.com/api", {})
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
