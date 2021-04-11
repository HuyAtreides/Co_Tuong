import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "../SignIn/SignIn.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";
import VerifyEmail from "../VerifyEmail/VerifyEmail.jsx";
import Home from "../Home/Home.jsx";
import useFetchData from "./useFetchData.js";
import { Spinner } from "react-bootstrap";
import {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  AuthenticateUserContext,
  authenticateUser,
  socket,
} from "./context.js";
import useHandleRoutingWhilePlaying from "./useHandleRoutingWhilePlaying.js";

function App() {
  useHandleRoutingWhilePlaying(socket, setMoveTimer);

  const [waitForResponse, setWaitForResponse] = useFetchData();

  if (waitForResponse)
    return (
      <Spinner
        animation="border"
        variant="secondary"
        className="main-spinner"
      />
    );

  return (
    <SocketContext.Provider value={socket}>
      <SetMoveTimerContext.Provider value={setMoveTimer}>
        <AuthenticateUserContext.Provider value={authenticateUser}>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/verify-email">
              <VerifyEmail />
            </Route>
            <Route path="/home/:name">
              <Home />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/">
              <Main setWaitForResponse={setWaitForResponse} />
            </Route>
          </Switch>
        </AuthenticateUserContext.Provider>
      </SetMoveTimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App };
