import React, { useState, useEffect } from "react";
import "./App.scss";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080/play");
const timer = new Worker("/web_worker_timer/webWorkerTimer.js");
const SocketContext = React.createContext();
const TimerContext = React.createContext();

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    return () => {
      timer.terminate();
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <TimerContext.Provider value={timer}>
        <Router>
          <Switch>
            <Route path="/login">
              <Login setIsAuthenticated={setIsAuthenticated} />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/">
              <Main isAuthenticated={isAuthenticated} />
            </Route>
          </Switch>
        </Router>
      </TimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App, SocketContext, TimerContext };
