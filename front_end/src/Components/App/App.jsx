import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../SignIn/SignIn.jsx';
import Main from '../Main/Main.jsx';
import Signup from '../Signup/Signup.jsx';
import Home from '../Home/Home.jsx';
import Settings from '../Settings/Settings.jsx';

import {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  AuthenticateUserContext,
  authenticateUser,
  socket,
} from './context.js';
import useHandleRoutingWhilePlaying from './useHandleRoutingWhilePlaying.js';

function App() {
  useHandleRoutingWhilePlaying(socket, setMoveTimer);

  return (
    <SocketContext.Provider value={socket}>
      <SetMoveTimerContext.Provider value={setMoveTimer}>
        <AuthenticateUserContext.Provider value={authenticateUser}>
          <Switch>
            <Route path='/signin'>
              <SignIn />
            </Route>
            <Route path='/signup'>
              <Signup />
            </Route>

            <Route path='/home/:name'>
              <Home />
            </Route>
            <Route path='/home'>
              <Home />
            </Route>
            <Route path='/settings'>
              <Settings />
            </Route>
            <Route path='/'>
              <Main />
            </Route>
          </Switch>
        </AuthenticateUserContext.Provider>
      </SetMoveTimerContext.Provider>
    </SocketContext.Provider>
  );
}

export { App };
