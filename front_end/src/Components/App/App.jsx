import React, { useState, useEffect } from "react";
import "./App.scss";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";
import VerifyEmail from "../VerifyEmail/VerifyEmail.jsx";
import {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  socket,
} from "./context.js";

function App(props) {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <SetMoveTimerContext.Provider value={setMoveTimer}>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/verify-email">
              <VerifyEmail />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
      </SetMoveTimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App };
