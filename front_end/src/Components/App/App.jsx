import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import SignIn from "../SignIn/SignIn.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";
import VerifyEmail from "../VerifyEmail/VerifyEmail.jsx";
import {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  AuthenticateUserContext,
  authenticateUser,
  socket,
} from "./context.js";

function App(props) {
  return (
    <SocketContext.Provider value={socket}>
      <SetMoveTimerContext.Provider value={setMoveTimer}>
        <AuthenticateUserContext.Provider value={authenticateUser}>
          <Router>
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
              <Route path="/">
                <Main />
              </Route>
            </Switch>
          </Router>
        </AuthenticateUserContext.Provider>
      </SetMoveTimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App };
