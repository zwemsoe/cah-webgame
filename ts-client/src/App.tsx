import React, { createContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Room from "./screens/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/:roomId' exact component={Room} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;