import { createContext } from 'react';
import ioClient from "socket.io-client";
import { config } from '../constants';

const url = config.url.API_URL;
export const socket = ioClient(url, {})
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
