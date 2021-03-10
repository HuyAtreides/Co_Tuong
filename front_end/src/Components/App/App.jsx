import React, { useState, useEffect } from "react";
import "./App.scss";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";
import {
  SocketContext,
  TimerContext,
  SetTimerContext,
  setTimer,
  socket,
  timer,
} from "./context.js";

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
        <SetTimerContext.Provider value={setTimer}>
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
        </SetTimerContext.Provider>
      </TimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App };
