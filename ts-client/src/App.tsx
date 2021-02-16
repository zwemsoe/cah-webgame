import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./screens/Home";
import Room from "./screens/Room";
import {SocketContext, socket} from './contexts/SocketContext';

const App = () => {
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    console.log("clientname: ", clientName);
    return () => {
      console.log("unmounting");
      socket.close();
    };
  }, []);


  return (
    <BrowserRouter>
      <Switch> 
        <SocketContext.Provider value={socket}>
          <Route path='/' exact render={(props) => <Home {...props} setClientName={setClientName}/>} />
          <Route path='/:roomId' exact render={(props) => clientName ? <Room {...props}/> : <Home {...props} setClientName={setClientName}/>} />
        </SocketContext.Provider>
    </Switch>
    </BrowserRouter>
  );
};

export default App;