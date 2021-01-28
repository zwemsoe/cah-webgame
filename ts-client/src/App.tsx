import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Home from "./screens/Home";
import Room from "./screens/Room";
import ioClient from "socket.io-client";
import {SocketContext} from './contexts/SocketContext';

const socket = ioClient("http://localhost:5000", {});

const App = () => {
  const [roomId, setRoomId] = useLocalStorage('roomId', '');
  //const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  // useEffect(() => {
    
  //   setSocket(newSocket);
  //   return () => {
  //     newSocket.close();
  //   };
  // }, [roomId]);

  return (
    <BrowserRouter>
      <Switch> 
      <SocketContext.Provider value={socket}>
        <Route path='/' exact render={(props) => <Home saveToLocalStorage={setRoomId} {...props}/>} />
        <Route path='/:roomId' exact render={(props) => <Room roomCode={roomId} {...props}/>} />
        </SocketContext.Provider>
    </Switch>
    </BrowserRouter>
  );
};

export default App;