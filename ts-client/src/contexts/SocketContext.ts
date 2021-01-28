import {createContext, useContext} from 'react';

export const SocketContext = createContext<SocketIOClient.Socket | null>(null);
