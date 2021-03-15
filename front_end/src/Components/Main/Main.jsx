import React from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";
import { useSelector } from "react-redux";
import Game from "./Game/Game.jsx";

const Main = () => {
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  return (
    <Container fluid>
      <NavBar isAuthenticated={isAuthenticated} />
      {!isAuthenticated ? <Game /> : <EntryComponent />}
    </Container>
  );
};

export default Main;
