import { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./screens/Home";
import Room from "./screens/Room";
import {SocketContext, socket} from './contexts/SocketContext';

const App = () => {

  useEffect(() => {
    return () => {
      console.log("unmounting");
      socket.close();
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch> 
        <SocketContext.Provider value={socket}>
          <Route path='/' exact render={(props) => <Home {...props}/>} />
          <Route path='/:roomId' exact render={(props) => <Room {...props}/>} />
          <Redirect to = "/" />
        </SocketContext.Provider>
    </Switch>
    </BrowserRouter>
  );
};

export default App;