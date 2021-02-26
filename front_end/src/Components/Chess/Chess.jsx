import React, { useState, useEffect } from "react";
import "./Chess.scss";
import Board from "../Board/Board.jsx";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Main from "../Main/Main.jsx";

function Chess(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setIsAuthenticated={setIsAuthenticated} />
        </Route>
        <Route path="/">
          <Main isAuthenticated={isAuthenticated} />
        </Route>
      </Switch>
    </Router>
    // <Board side={["red", "black"]} />;
  );
}

export default Chess;
