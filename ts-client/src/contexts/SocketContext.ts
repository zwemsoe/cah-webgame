import {createContext} from 'react';
import ioClient from "socket.io-client";

export const socket = ioClient("http://localhost:5000", {})
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
