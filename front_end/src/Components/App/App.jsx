import React, { useState, useEffect } from "react";
import "./App.scss";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";
import Signup from "../Signup/Signup.jsx";

function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
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
  );
}

export default App;
