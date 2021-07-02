import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Room from './screens/Room';
import {SocketContext, socket} from './contexts/SocketContext';
import { fetchFromLocalStorage } from "./utils";

const App = () => {
  const [clientName, setClientName] = useState<string | null>(fetchFromLocalStorage('current-user'));

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);


  return (
    <BrowserRouter>
      <Switch> 
        <SocketContext.Provider value={socket}>
          <Route path='/' exact render={(props) => <Home {...props} setClientName={setClientName}/>} />
          <Route path='/game/:roomId' exact render={(props) => clientName ? <Room {...props}/> : <Home {...props} setClientName={setClientName}/>} />
        </SocketContext.Provider>
    </Switch>
    </BrowserRouter>
  );
};

export default App;