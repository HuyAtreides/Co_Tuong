import React from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";
import Game from "./Game/Game.jsx";

const Main = (props) => {
  return (
    <Container fluid>
      <NavBar isAuthenticated={props.isAuthenticated} />
      {!props.isAuthenticated ? <Game /> : <EntryComponent />}
    </Container>
  );
};

export default Main;
